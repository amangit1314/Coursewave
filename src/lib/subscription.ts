import { userSubscriptionPlans, instructorSubscriptionPlans, type SubscriptionPlan } from "./subscriptionPlans";

export type UserSubscription = {
  id?: string;
  name?: string;
  description?: string;
  whatIncludes?: string[];
  stripePriceId?: string;
  price?: number;
  stripeSubscriptionId: string | null;
  stripeCurrentPeriodEnd: number | undefined;
  stripeCustomerId: string | null;
  isSubscribed: boolean;
  isCanceled: boolean;
  type?: 'USER' | 'INSTRUCTOR';
  status?: 'ACTIVE' | 'CANCELED' | 'EXPIRED';
  currentPeriodStart?: number;
  cancelAtPeriodEnd?: boolean;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5002';

export const getUserSubscriptionPlan = async (userId: string): Promise<UserSubscription | null> => {
  try {
    // Get the auth token from localStorage
    const authToken = typeof window !== "undefined" 
      ? localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
      : null;

    if (!authToken) {
      console.warn('No authentication token found for subscription fetch');
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/subscriptions/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.warn('Authentication failed for subscription fetch');
        return null;
      }
      throw new Error(`Failed to fetch subscription data: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
      return null;
    }

    // Transform the data to match UserSubscription type
    const subscription = data.data[0]; // Get the first subscription
    if (!subscription) {
      return null;
    }

    return {
      id: subscription.id,
      name: subscription.plan?.name,
      description: subscription.plan?.description,
      stripePriceId: subscription.plan?.stripePriceId,
      price: subscription.plan?.price,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      stripeCurrentPeriodEnd: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).getTime() : undefined,
      stripeCustomerId: subscription.stripeCustomerId,
      isSubscribed: subscription.status === 'ACTIVE',
      isCanceled: subscription.status === 'CANCELED',
      type: 'USER',
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart ? new Date(subscription.currentPeriodStart).getTime() : undefined,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd || false,
    };
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return null;
  }
};

export const getInstructorSubscriptionPlan = async (instructorId: string): Promise<UserSubscription | null> => {
  try {
    // Get the auth token from localStorage
    const authToken = typeof window !== "undefined" 
      ? localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
      : null;

    if (!authToken) {
      console.warn('No authentication token found for instructor subscription fetch');
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/subscriptions/instructor`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.warn('Authentication failed for instructor subscription fetch');
        return null;
      }
      throw new Error(`Failed to fetch instructor subscription data: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
      return null;
    }

    // Transform the data to match UserSubscription type
    const subscription = data.data[0]; // Get the first subscription
    if (!subscription) {
      return null;
    }

    return {
      id: subscription.id,
      name: subscription.plan?.name,
      description: subscription.plan?.description,
      stripePriceId: subscription.plan?.stripePriceId,
      price: subscription.plan?.price,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      stripeCurrentPeriodEnd: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).getTime() : undefined,
      stripeCustomerId: subscription.stripeCustomerId,
      isSubscribed: subscription.status === 'ACTIVE',
      isCanceled: subscription.status === 'CANCELED',
      type: 'INSTRUCTOR',
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart ? new Date(subscription.currentPeriodStart).getTime() : undefined,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd || false,
    };
  } catch (error) {
    console.error('Error fetching instructor subscription:', error);
    return null;
  }
};

export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    console.log('Fetching subscription plans from:', `${API_BASE_URL}/api/subscriptions/plans`);
    
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/plans`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`Failed to fetch subscription plans: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    
    if (!data.success || !data.data) {
      console.warn('No data in response, returning empty array');
      return [];
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return [];
  }
};

export const subscribeToPlan = async (planId: string, stripeSubscriptionId: string, userType: 'USER' | 'INSTRUCTOR' = 'USER'): Promise<any> => {
  try {
    const endpoint = userType === 'USER' ? '/user/subscribe' : '/instructor/subscribe';
    
    // Get the auth token from localStorage
    const authToken = typeof window !== "undefined" 
      ? localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
      : null;

    if (!authToken) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/subscriptions${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        planId,
        stripeSubscriptionId,
        ...(userType === 'INSTRUCTOR' && { stripeAccountId: stripeSubscriptionId })
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe to plan');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Subscription failed');
    }

    return data.data;
  } catch (error) {
    console.error('Error subscribing to plan:', error);
    throw error;
  }
};

export const cancelSubscription = async (userType: 'USER' | 'INSTRUCTOR' = 'USER'): Promise<any> => {
  try {
    const endpoint = userType === 'USER' ? '/user/cancel' : '/instructor/cancel';
    
    // Get the auth token from localStorage
    const authToken = typeof window !== "undefined" 
      ? localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
      : null;

    if (!authToken) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/subscriptions${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Cancellation failed');
    }

    return data;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

export const checkSubscriptionAccess = (
  userSubscription: UserSubscription | null,
  requiredFeature: 'courses' | 'sessions' | 'analytics' | 'publish' | 'promote'
): boolean => {
  if (!userSubscription || !userSubscription.isSubscribed) {
    return false;
  }

  // Find the current plan
  const allPlans = [...userSubscriptionPlans, ...instructorSubscriptionPlans];
  const currentPlan = allPlans.find(plan => plan.stripePriceId === userSubscription.stripePriceId);
  
  if (!currentPlan) {
    return false;
  }

  // Check if subscription is active
  if (userSubscription.stripeCurrentPeriodEnd && userSubscription.stripeCurrentPeriodEnd < Date.now()) {
    return false;
  }

  // Check feature access based on plan
  switch (requiredFeature) {
    case 'courses':
      return currentPlan.features.maxCourses === -1 || (currentPlan.features.maxCourses ?? 0) > 0;
    case 'sessions':
      return currentPlan.features.sessionsPerDay === -1 || (currentPlan.features.sessionsPerDay ?? 0) > 0;
    case 'analytics':
      return currentPlan.features.analytics || false;
    case 'publish':
      return currentPlan.features.canPublish || false;
    case 'promote':
      return currentPlan.features.canPromote || false;
    default:
      return false;
  }
};

export const getSubscriptionPlansByType = (type: 'USER' | 'INSTRUCTOR'): SubscriptionPlan[] => {
  return type === 'USER' ? userSubscriptionPlans : instructorSubscriptionPlans;
}; 