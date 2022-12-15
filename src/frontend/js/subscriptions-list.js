/*
dependencies:
  jquery (see: https://jquery.com/)
  ./api/backend.js
  ./app-state.jss
*/


function initSubscriptionsList(){

  const body = $('body');

  loadSubscriptionsList().catch(console.error);

  body.on('wallet-connected', async ()=> updateUserSubscriptions());
  body.on('wallet-account-changed', async ()=> updateUserSubscriptions());
  body.on('wallet-disconnected', async ()=> updateUserSubscriptions());
  body.on('subscription-plans-updated', async ()=> showSubscriptionsList());
  body.on('user-subscriptions-updated', async ()=> showUserSubscriptions());
  body.on('global-loading-start', disableAllSubscriptionsButtons);
  body.on('global-loading-stop', enableAllSubscriptionsButtons);
  body.on('activate-user-subscription-success', async ()=> updateUserSubscriptions());
  body.on('activate-user-subscription-failed', async ()=> updateUserSubscriptions());
  body.on('deactivate-user-subscription-success', async ()=> updateUserSubscriptions());
  body.on('deactivate-user-subscription-failed', async ()=> updateUserSubscriptions());
}


async function loadSubscriptionsList(){

  const root = $('#subscriptions-list');

  root.empty();
  root.append($('#templates .subscriptions-list-loading').clone());

  try {
    const plans = await Backend.getSubscriptionPlans();
    setSubscriptionPlans(plans);
  } catch (e){
    console.error('cannot load subscriptions', e);
    showSubscriptionsListLoadingError(e);
  }
}

async function showSubscriptionsList(){

  const root = $('#subscriptions-list');

  root.empty();
  AppState.subscriptionPlans.forEach(sub => {
    root.append(createSubscriptionElem(sub));
  });

  await updateUserSubscriptions();
}


async function updateUserSubscriptions(){

  // no plans yet
  if($('#subscriptions-list .subscriptions-list-item').length === 0){
    return;
  }

  if( ! AppState.walletConnected){
    await showUserSubscriptions();
    return;
  }

  let address;

  try {

    address = await AppState.walletApi.getAddress();
    const subscriptions = await Backend.getUserSubscriptions(address);
    setUserSubscriptions(address, subscriptions);

  } catch (e){
    console.error('cannot update subscriptions status', e);

    if(address){
      setUserSubscriptions(address, undefined);
    }
  }
}

async function showUserSubscriptions(){

  if( ! AppState.walletConnected){
    await showSubscriptionsUnknownStatuses();
    return;
  }


  const address = await AppState.walletApi.getAddress();
  const subscriptions = AppState.userSubscriptions[address];

  if(subscriptions === undefined){
    await showSubscriptionsUnknownStatuses();
    return;
  }

  $('#subscriptions-list .subscriptions-list-item').each((i, elem)=>{

    const item = $(elem);
    const planId = item.attr('data-plan-id');
    const foundSub = subscriptions.find(sub => sub.planId === planId);

    showUserSubscriptionStatus(item, foundSub);
    showUserSubscriptionActions(item, foundSub);
  });
}

function showUserSubscriptionStatus(item, subscription){

  const status = $('.status', item);
  status.empty();

  let statusVal;
  if( ! subscription){
    statusVal = $('#templates .subscriptions-list-item-status-not-activated').clone();
  } else {

    const {status} = subscription;

    statusVal = $('#templates .subscriptions-list-item-status').clone();
    statusVal.text(status);

    if(status === 'Active'){
      statusVal.removeClass('bg-light text-dark').addClass('bg-success');
    }
  }
  status.append(statusVal);
}

function showUserSubscriptionActions(item, subscription){

  const activateBtn = $('.activate', item);
  const deactivateBtn = $('.deactivate', item);
  const status = subscription?.status;

  if( ! status || status === 'Draft'){
    activateBtn.removeClass('hide');
    deactivateBtn.addClass('hide');
  } else {
    activateBtn.addClass('hide');
    deactivateBtn.removeClass('hide');
  }
}



function createSubscriptionElem(plan){

  const body = $('body');
  const {id, description, amount, periodSeconds, tags} = plan;

  const periodDays = periodSeconds / (60 * 60 * 24);
  const roundedPeriodDays = Math.round (periodDays * 10000) / 10000;

  const elem = $('#templates .subscriptions-list-item').clone();
  elem.attr('data-plan-id', id);

  const [price, asset] = amount.split(' ');
  const {abbr} = Assets[asset];

  $('.description', elem).text(description);
  $('.amount', elem).text(`${price} ${abbr}`);
  $('.period', elem).text(roundedPeriodDays);
  $('.tags', elem).text(tags.join(' '));
  $('.activate', elem).click(()=>{
    body.trigger('activate-user-subscription-req', [id]);
  });
  $('.deactivate', elem).click(()=>{
    body.trigger('deactivate-user-subscription-req', [id]);
  })

  return elem;
}


function showSubscriptionsListLoadingError(err){

  const msg = err.message || err.toString();
  const clone = $('#templates .subscriptions-list-loading-error').clone();
  clone.find('.msg').text(msg);

  const root = $('#subscriptions-list');
  root.empty();
  root.append(clone);
}


function showSubscriptionsUnknownStatuses(){
  $('#subscriptions-list .subscriptions-list-item .status').each((i, elem)=>{
    const status = $(elem);
    const needWalletStatus = $('#templates .subscriptions-list-item-status-no-wallet').clone();
    status.empty();
    status.append(needWalletStatus);
  });

  // hide buttons
  $('#subscriptions-list .subscriptions-list-item button').addClass('hide');
}


function disableAllSubscriptionsButtons(){
  $('#subscriptions-list .subscriptions-list-item button').attr('disabled', 'disabled').blur();
}

function enableAllSubscriptionsButtons(){
  $('#subscriptions-list .subscriptions-list-item button').removeAttr('disabled');
}