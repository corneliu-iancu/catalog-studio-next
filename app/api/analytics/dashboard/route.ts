import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    const days = parseInt(searchParams.get('days') || '30');

    if (!restaurantId) {
      return NextResponse.json({ error: 'Restaurant ID required' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Verify user has access to this restaurant
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user owns this restaurant
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id, user_id')
      .eq('id', restaurantId)
      .eq('user_id', user.id)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    // Try to get daily analytics first, fallback to raw data if none exists
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));

    const { data: dailyStats, error: statsError } = await supabase
      .from('daily_analytics')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    let trafficData = [];

    // If no aggregated data exists, calculate from raw events
    if (!dailyStats || dailyStats.length === 0) {
      // Get raw analytics events
      const { data: rawEvents, error: rawError } = await supabase
        .from('menu_analytics')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())
        .order('timestamp', { ascending: true });

      if (rawError) {
        console.error('Raw analytics fetch error:', rawError);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
      }

      const dailyGroups = rawEvents?.reduce((acc: any, event: any) => {
        const date = event.timestamp.split('T')[0];
        if (!acc[date]) {
          acc[date] = {
            visits: new Set(),
            pageViews: 0,
            uniqueVisitors: new Set(),
          };
        }
        
        // Count unique sessions as visits
        if (event.event_type === 'page_view') {
          acc[date].visits.add(event.session_id);
          acc[date].pageViews++;
        }
        
        // Count unique visitors
        acc[date].uniqueVisitors.add(event.session_id);
        
        return acc;
      }, {}) || {};

      // Transform to expected format
      trafficData = Object.entries(dailyGroups).map(([date, data]: [string, any]) => ({
        date,
        visits: data.visits.size,
        uniqueVisitors: data.uniqueVisitors.size,
        pageViews: data.pageViews,
        bounceRate: 0, // Can't calculate bounce rate from raw data easily
      }));

    } else {
      // Use aggregated data
      trafficData = dailyStats.map(stat => ({
        date: stat.date,
        visits: stat.total_visits,
        uniqueVisitors: stat.unique_visitors,
        pageViews: stat.total_page_views,
        bounceRate: Math.round(stat.bounce_rate || 0),
      }));
    }

    // Calculate metrics
    const totalVisits = trafficData.reduce((sum, day) => sum + day.visits, 0);
    const totalUniqueVisitors = trafficData.reduce((sum, day) => sum + day.uniqueVisitors, 0);
    const todayVisits = trafficData[trafficData.length - 1]?.visits || 0;
    
    // Weekly average (last 7 days)
    const lastWeek = trafficData.slice(-7);
    const weeklyTotal = lastWeek.reduce((sum, day) => sum + day.visits, 0);
    const weeklyAverage = Math.round(weeklyTotal / Math.max(lastWeek.length, 1));
    
    // Previous week for comparison
    const previousWeek = trafficData.slice(-14, -7);
    const previousWeekTotal = previousWeek.reduce((sum, day) => sum + day.visits, 0);
    const previousWeekAverage = previousWeekTotal / Math.max(previousWeek.length, 1);
    
    const percentChange = previousWeekAverage > 0 
      ? Math.round(((weeklyAverage - previousWeekAverage) / previousWeekAverage) * 100)
      : 0;

    const metrics = {
      todayVisits,
      weeklyAverage,
      monthlyTotal: totalVisits,
      percentChange,
      totalUniqueVisitors,
    };

    return NextResponse.json({
      data: trafficData,
      metrics,
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
