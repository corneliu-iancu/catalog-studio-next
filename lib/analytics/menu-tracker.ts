/**
 * Menu Analytics Tracker
 * Privacy-first analytics for restaurant menus
 */

interface AnalyticsEvent {
  type: 'page_view' | 'item_view' | 'category_view' | 'time_spent';
  restaurantId: string;
  menuId?: string;
  itemId?: string;
  categoryId?: string;
  timeSpent?: number;
  metadata?: Record<string, any>;
}

class MenuAnalytics {
  private sessionId: string;
  private startTime: number;
  private currentPage: string;
  private consentGiven: boolean = false;
  private queue: AnalyticsEvent[] = [];

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.startTime = Date.now();
    this.currentPage = window.location.pathname;
    this.initializeConsent();
    this.setupEventListeners();
  }

  private getOrCreateSessionId(): string {
    // Check for session expiration (30 minutes of inactivity)
    const sessionTimestamp = sessionStorage.getItem('analytics_session_timestamp');
    const currentTime = Date.now();
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    
    if (sessionTimestamp) {
      const lastActivity = parseInt(sessionTimestamp);
      if (currentTime - lastActivity > sessionTimeout) {
        // Session expired, clear old session
        this.clearSession();
      }
    }
    
    // Try to get existing session ID from sessionStorage
    const existingSessionId = sessionStorage.getItem('analytics_session_id');
    
    if (existingSessionId) {
      // Update timestamp for activity tracking
      sessionStorage.setItem('analytics_session_timestamp', currentTime.toString());
      return existingSessionId;
    }
    
    // Generate new session ID if none exists
    const newSessionId = crypto.randomUUID();
    sessionStorage.setItem('analytics_session_id', newSessionId);
    sessionStorage.setItem('analytics_session_timestamp', currentTime.toString());
    
    return newSessionId;
  }

  private clearSession(): void {
    sessionStorage.removeItem('analytics_session_id');
    sessionStorage.removeItem('analytics_session_timestamp');
  }

  // Update session activity timestamp on user interactions
  private updateSessionActivity(): void {
    sessionStorage.setItem('analytics_session_timestamp', Date.now().toString());
  }

  private initializeConsent() {
    // Check for existing consent cookie
    const consent = this.getCookie('analytics_consent');
    this.consentGiven = consent === 'true';
    
    if (!consent) {
      this.showConsentBanner();
    }
  }

  private showConsentBanner() {
    // Show privacy-compliant consent banner
    // Implementation depends on your UI framework
    console.log('Show analytics consent banner');
  }

  public giveConsent() {
    this.consentGiven = true;
    this.setCookie('analytics_consent', 'true', 365);
    this.flushQueue();
  }

  public revokeConsent() {
    this.consentGiven = false;
    this.setCookie('analytics_consent', 'false', 365);
    this.queue = [];
  }

  private setupEventListeners() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackTimeSpent();
      } else {
        this.startTime = Date.now();
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.trackTimeSpent();
      this.flushQueue();
    });

    // Track clicks on menu items
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const menuItem = target.closest('[data-menu-item-id]');
      const category = target.closest('[data-category-id]');
      
      if (menuItem) {
        this.trackItemView(menuItem.getAttribute('data-menu-item-id')!);
      } else if (category) {
        this.trackCategoryView(category.getAttribute('data-category-id')!);
      }
    });
  }

  public trackPageView(restaurantId: string, menuId?: string) {
    this.track({
      type: 'page_view',
      restaurantId,
      menuId,
      metadata: {
        path: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenSize: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`
      }
    });
  }

  public trackItemView(itemId: string) {
    const restaurantId = this.getRestaurantIdFromPath();
    this.track({
      type: 'item_view',
      restaurantId,
      itemId
    });
  }

  public trackCategoryView(categoryId: string) {
    const restaurantId = this.getRestaurantIdFromPath();
    this.track({
      type: 'category_view',
      restaurantId,
      categoryId
    });
  }

  private trackTimeSpent() {
    const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
    if (timeSpent > 5) { // Only track if spent more than 5 seconds
      const restaurantId = this.getRestaurantIdFromPath();
      this.track({
        type: 'time_spent',
        restaurantId,
        timeSpent
      });
    }
  }

  private track(event: AnalyticsEvent) {
    // Update session activity on any tracking event
    this.updateSessionActivity();
    
    if (!this.consentGiven) {
      this.queue.push(event);
      return;
    }

    this.sendEvent(event);
  }

  private async sendEvent(event: AnalyticsEvent) {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  private flushQueue() {
    if (this.consentGiven && this.queue.length > 0) {
      this.queue.forEach(event => this.sendEvent(event));
      this.queue = [];
    }
  }

  private getRestaurantIdFromPath(): string {
    // Extract restaurant ID from URL path
    const pathParts = window.location.pathname.split('/');
    return pathParts[1] || ''; // Assuming /[restaurant-slug]/...
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  private setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Strict`;
  }
}

// Initialize analytics
let analytics: MenuAnalytics;

export function initMenuAnalytics() {
  if (typeof window !== 'undefined' && !analytics) {
    analytics = new MenuAnalytics();
  }
  return analytics;
}

export function trackPageView(restaurantId: string, menuId?: string) {
  analytics?.trackPageView(restaurantId, menuId);
}

export function giveAnalyticsConsent() {
  analytics?.giveConsent();
}

export function revokeAnalyticsConsent() {
  analytics?.revokeConsent();
}
