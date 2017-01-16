var checkList = [
  {
    id: 't-promise',
    title: 'Promise',
    comment: 'Service Workers heavily rely on Promise.',
    score: 1
  },
  {
    id: 't-interface',
    title: 'navigator.serviceWorker',
    score: 0
  },
  {
    id: 't-message',
    title: 'message passing',
    score: 1
  },
  {
    id: 't-register',
    title: '<i>register</i>',
    score: 1
  },
  {
    id: 't-unregister',
    title: '<i>unregister</i>',
    score: 1
  },
  {
    id: 't-install',
    title: '<i>install</i> event',
    score: 1
  },
  {
    id: 't-activate',
    title: '<i>activate</i> event',
    score: 1
  },
  {
    id: 't-fetch',
    title: '<i>fetch</i> event',
    score: 1
  },
  {
    id: 't-respondWith',
    title: '<i>respondWith</i>',
    score: 1
  },
  {
    id: 't-caches-open',
    title: 'caches.open',
    score: 1
  },
  {
    id: 't-caches-match',
    title: 'caches.match',
    score: 1
  },
  {
    id: 't-caches-has',
    title: 'caches.has',
    score: 1
  },
  {
    id: 't-caches-delete',
    title: 'caches.delete',
    score: 1
  }
];

var currentScore = 0;
function runTest(idx){

}

function runAllTests(){
  var totalScore = 0, htmlStr = '';
  for (var i = 0, len = checkList.length; i < len; i++) {
    totalScore += checkList[i].score;
    var idx = (1001 + i).toString().substr(2);
    htmlStr += '<li id="' + checkList[i].id + '" data-score="' + checkList[i].score +
      '" class="failed"><div class="check-point">' + idx + '. ' + checkList[i].title +
      '<div class="check-status"></div></div>'
    if (checkList[i].comment) {
      htmlStr += '<div class="comment-field">' + checkList[i].comment + '</div>';
    }
  }
  document.getElementsByClassName('total-score')[0].textContent = totalScore;
  document.getElementById('check-list').innerHTML = htmlStr;

  var ret = checkPromiseSupport();
  if (typeof ret == 'boolean') {
    if (ret) {
      markTestResult('t-promise', true);
      checkServiceWorkerRegistration();
    }
  } else if (typeof ret.then == 'function') {
    ret.then(function(){
      markTestResult('t-promise', true);
      checkServiceWorkerRegistration();
    });
  }
  if (checkServiceWorkerInterface()) {
    markTestResult('t-interface', true);
  }
}

function checkPromiseSupport(){
  if (!!Promise &&
    typeof Promise.resolve == 'function' &&
    typeof Promise.reject == 'function') {
    return new Promise(function(resolve, reject){
      window.setTimeout(function(){
        resolve('Promise supported!');
      }, 1);
    });
  } else {
    return false;
  }
}

function checkServiceWorkerInterface(){
  return (!!navigator.serviceWorker &&
    (typeof ServiceWorkerContainer == 'function') &&
    (navigator.serviceWorker instanceof ServiceWorkerContainer));
}

function markTestResult(testId, isSupported){
  var elLi = document.getElementById(testId);

  if (isSupported) {
    if (elLi.className != 'passed') {
      elLi.className = 'passed';
      currentScore += 1;
      document.getElementsByClassName('big-score')[0].textContent = currentScore;
    }
  } else {
    elLi.className = 'failed';
  }
}
/*
function checkMessagePassing(){
  var elIframe = document.createElement('iframe');
  elIframe.src = "inner-page.html";
  document.body.appendChild(elIframe);
  window.addEventListener('message', onMessage, false);
}
*/
navigator.serviceWorker.addEventListener('message', function(event) {
  var arr = event.data ? event.data.split(':') : [];
  console.log(arr);
  if (arr.length >= 2 && arr[0] == 'succ'){
    var strId = event.data.replace('succ:', 't-').replace(':', '-');
    markTestResult(strId, true);
  }
  console.log(event);
}, false);
function checkServiceWorkerRegistration(){
  navigator.serviceWorker.register('sw.js').then(function(registration) {
      // Registration succeeded.
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      /*registration.unregister().then(function(){
        console.log('ServiceWorker unregistration successful');
        markTestResult('T-register', true);
      });*/
    }).catch(function(err) {
      // Registration failed.
      console.log('ServiceWorker registration failed: ', err);
    });
}

runAllTests();