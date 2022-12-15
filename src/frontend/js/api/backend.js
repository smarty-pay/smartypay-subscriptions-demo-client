

/**
 * Backend http api: see /src/backend/index.js
 */
const Backend = {

  async getSubscriptionPlans(){
    const resp = await fetch('/api/subscription-plans');
    const {plans} = await resp.json();
    return plans;
  },

  async getUserSubscriptions(payerAddress){
    const resp = await fetch(`/api/user/subscriptions?payer=${payerAddress}`);
    const {subscriptions} = await resp.json();
    return subscriptions;
  },

  async createUserSubscription(planId, payerAddress){
    const resp = await fetch('/api/user/create-subscription', {
      method: 'POST',
      body: JSON.stringify({
        planId,
        payer: payerAddress,
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return await resp.json();
  },

  async activateUserSubscription(contractAddress){
    const resp = await fetch('/api/user/activate-subscription', {
      method: 'POST',
      body: JSON.stringify({
        contractAddress
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return await resp.json();
  },

  async deactivateUserSubscription(contractAddress){
    const resp = await fetch('/api/user/deactivate-subscription', {
      method: 'POST',
      body: JSON.stringify({
        contractAddress
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return await resp.json();
  }
}