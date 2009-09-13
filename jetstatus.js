twitter = {
  goToSite: function () {
    jetpack.tabs.open("http://twitter.com");
    jetpack.tabs[jetpack.tabs.length-1].focus();
  },

  update: function () {
    $.ajax({
      type: "GET",
      url: "http://twitter.com/statuses/friends_timeline.json?since_id="+store.lastId,
      dataType: "json",
      success: function (tweets) {
        console.log(tweets.length + " new tweets");
        if (tweets.length == 0) return;
        tweets.sort(function (a, b) {
          return a.id - b.id;
        });
        $.each(tweets, function () {
          if (this.id > store.lastId) {
            store.lastId = this.id;
            jetpack.storage.live.history.unshift(this);
            queue.push({
              title: this.user.name,
              body: this.text,
              icon: this.user.profile_image_url
            });
          }
        });
        twitter.showNotifications();
      },
      error: function (req, status, error) {
        console.log(status + ' ' + error);
      }    
    });
  },

  showNotifications: function () {
    if (queue.length > 0) {
      jetpack.notifications.show(queue.shift());
      notifier = setTimeout(twitter.showNotifications, 6000);
    } else 
      clearTimeout(notifier);
  },

  resume: function () {
    twitter.update();
    poller = setInterval(twitter.update, 60*1000);
  },

  suspend: function() {
    clearInterval(poller);
    clearTimeout(notifier);
  },
}

jetpack.future.import("storage.simple");
store = jetpack.storage.simple;
if (!store.lastId)
  store.lastId = 1;
queue = [];
jetpack.storage.live.history = [];
notifier = 0;
poller = 0;

jetpack.statusBar.append({
  html: '<img src="http://twitter.com/favicon.ico"><input type="checkbox">',
  onReady: function (doc) {
    $("input", doc).click(function () {
      if (this.checked)
        twitter.resume();
      else
        twitter.suspend();
    });
    $("img", doc).click(twitter.goToSite);
  },
  width: 36
});

jetpack.future.import("slideBar");
jetpack.slideBar.append({
  icon: "http://twitter.com/favicon.ico",
  width: 300,
  onClick: function (slider) {
    $("ol", slider.contentDocument.body).empty();
    jetpack.storage.live.history.forEach(function (elem) {
      $("ol", slider.contentDocument.body).append('<li><span class="avatar"><a href="' +
        'http://twitter.com/' + elem.user.screen_name+'"><img height="48" width="48" src="' +
        elem.user.profile_image_url + '" alt="'+elem.user.name+'"/></a></span>' +
        '<span class="main"><strong><a title="'+elem.user.name+'" href="http://twitter.com/'+
        elem.user.screen_name+'">'+elem.user.screen_name+'</a></strong><span>'+elem.text+
        '</span></span></li>');
    });
  },
  html: <>
    <body>
      <ol>
      </ol>
    </body>
  </>
});
