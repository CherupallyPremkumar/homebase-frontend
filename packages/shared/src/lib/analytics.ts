type EventProperties = Record<string, string | number | boolean | undefined>;

interface AnalyticsProvider {
  track: (event: string, properties?: EventProperties) => void;
  page: (name: string, properties?: EventProperties) => void;
  identify: (userId: string, traits?: EventProperties) => void;
}

const consoleProvider: AnalyticsProvider = {
  track: (event, properties) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] track:', event, properties);
    }
  },
  page: (name, properties) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] page:', name, properties);
    }
  },
  identify: (userId, traits) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] identify:', userId, traits);
    }
  },
};

let provider: AnalyticsProvider = consoleProvider;

export function setAnalyticsProvider(p: AnalyticsProvider) {
  provider = p;
}

export function track(event: string, properties?: EventProperties) {
  provider.track(event, properties);
}

export function trackPage(name: string, properties?: EventProperties) {
  provider.page(name, properties);
}

export function identifyUser(userId: string, traits?: EventProperties) {
  provider.identify(userId, traits);
}
