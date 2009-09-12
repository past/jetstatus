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
  },
}

jetpack.future.import("storage.simple");
store = jetpack.storage.simple;
if (!store.lastId)
  store.lastId = 1;
queue = [];
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
