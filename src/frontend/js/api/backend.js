

/**
 * Backend http api: see /src/backend/index.js
 */
const Backend = {

  async getSubscriptionPlans(){
    const resp = await fetch('/api/subscription-plans').then(handleError);
    const {plans} = await resp.json();
    return plans;
  },

  async getUserSubscriptions(payerAddress){
    const resp = await fetch(`/api/user/subscriptions?payer=${payerAddress}`).then(handleError);
    let {subscriptions} = await resp.json();

    // ignore Cancelled subs
    subscriptions = subscriptions.filter(sub => sub.status !== 'Cancelled' && sub.status !== 'Draft');

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
    }).then(handleError);;

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
    }).then(handleError);;

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
    }).then(handleError);;

    return await resp.json();
  },


  async pauseUserSubscription(contractAddress){
    const resp = await fetch('/api/user/pause-subscription', {
      method: 'POST',
      body: JSON.stringify({
        contractAddress
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(handleError);;

    return await resp.json();
  },


  async unpauseUserSubscription(contractAddress){
    const resp = await fetch('/api/user/unpause-subscription', {
      method: 'POST',
      body: JSON.stringify({
        contractAddress
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(handleError);;

    return await resp.json();
  }
}


async function handleError(resp){
  if( ! resp.ok){
    try {
      const data = await resp.json();
      throw new Error(data.message);
    } catch (e){
      throw new Error(resp.statusText);
    }
  }
  return resp;
}