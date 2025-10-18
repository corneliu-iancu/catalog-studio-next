import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import crypto from 'crypto';

interface TrackingEvent {
  type: 'page_view' | 'item_view' | 'category_view' | 'time_spent';
  restaurantId: string;
  menuId?: string;
  itemId?: string;
  categoryId?: string;
  timeSpent?: number;
  sessionId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(identifier: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= limit) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

function anonymizeIP(ip: string): string {
  // Hash IP for privacy compliance
  return crypto.createHash('sha256').update(ip + process.env.IP_SALT).digest('hex').substring(0, 16);
}

function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile')) return 'mobile';
  if (ua.includes('tablet') || ua.includes('ipad')) return 'tablet';
  return 'desktop';
}

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const userAgent = headersList.get('user-agent') || '';
    
    // Rate limiting
    const clientId = anonymizeIP(ip);
    if (!rateLimit(clientId)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const event: TrackingEvent = await request.json();
    
    // Validate required fields
    if (!event.restaurantId || !event.type || !event.sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Verify restaurant exists and is active
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id, is_active')
      .eq('id', event.restaurantId)
      .single();

    if (restaurantError) {
      console.error('Restaurant lookup error:', restaurantError, 'for restaurantId:', event.restaurantId);
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    if (!restaurant) {
      console.error('Restaurant not found for ID:', event.restaurantId);
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    if (!restaurant.is_active) {
      console.log('Restaurant not active:', event.restaurantId);
      return NextResponse.json({ error: 'Restaurant not active' }, { status: 403 });
    }

    // Insert analytics event
    const { error: insertError } = await supabase
      .from('menu_analytics')
      .insert({
        id: crypto.randomUUID(), // Explicitly generate UUID
        restaurant_id: event.restaurantId,
        menu_id: event.menuId,
        session_id: event.sessionId,
        ip_hash: anonymizeIP(ip),
        user_agent_hash: crypto.createHash('sha256').update(userAgent).digest('hex').substring(0, 16),
        event_type: event.type,
        page_path: event.metadata?.path,
        item_id: event.itemId,
        category_id: event.categoryId,
        timestamp: event.timestamp,
        time_spent: event.timeSpent,
        referrer: event.metadata?.referrer,
        device_type: getDeviceType(userAgent),
      });

    if (insertError) {
      console.error('Analytics insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save analytics' }, { status: 500 });
    }

    // Trigger daily aggregation if needed (could be done via cron job)
    // Temporarily disabled until database function is verified
    // await triggerDailyAggregation(event.restaurantId);

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function triggerDailyAggregation(restaurantId: string) {
  // This could be moved to a background job/cron
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];
  
  // Check if today's aggregation already exists
  const { data: existing } = await supabase
    .from('daily_analytics')
    .select('id')
    .eq('restaurant_id', restaurantId)
    .eq('date', today)
    .single();

  if (existing) return; // Already aggregated today

  // Aggregate today's data
  try {
    const { data: analytics, error } = await supabase.rpc('aggregate_daily_analytics', {
      p_restaurant_id: restaurantId,
      p_date: today
    });

    if (error) {
      console.error('Daily aggregation error:', error);
      // Don't fail the request if aggregation fails
    }
  } catch (error) {
    console.error('Daily aggregation function error:', error);
    // Don't fail the request if aggregation function doesn't exist
  }
}
