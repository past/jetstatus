/*
 * Copyright (c) 2009 Panagiotis Astithas. MIT-licensed.
 *
 * Icons by Paul Robert Lloyd (http://paulrobertlloyd.com/). Licenced under a
 * Attribution-Share Alike 2.0 UK: England & Wales Licence
 * (http://creativecommons.org/licenses/by-sa/2.0/uk/)
 */
jetpack.future.import("storage.simple");
jetpack.future.import("slideBar");

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

  smallIcon: "data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAAulBMVEX////3+vv3+vru9vbW6erM4+TH4uK73+C/29633d282tu02tu21tmw2Nmt1dal1NWp0tOh0dKl0NGczs+hzc6ey8yYy8yaycmTx8iWxseVxcaQxMWPxMWKwcKLwcGIwMGJvr+Gvr+Fvr+EvcGFvcKBu7x9uLl5tbl5tbp4tbZ0sbJ1sbhsrLN1o6RyoaJvn6BsnZ5pm5xmmZpjlpdglJVdkpNakJFXjo9UjI1QiotOh4hKhYZIg4T///+EFEN3AAAAPnRSTlP/////////////////////////////////////////////////////////////////////////////////ALr7cTYAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzOY1kYDAAAAFXRFWHRDcmVhdGlvbiBUaW1lADI3LzMvMDnorKSMAAAEEXRFWHRYTUw6Y29tLmFkb2JlLnhtcAA8P3hwYWNrZXQgYmVnaW49IiAgICIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA0LjEtYzAzNCA0Ni4yNzI5NzYsIFNhdCBKYW4gMjcgMjAwNyAyMjoxMTo0MSAgICAgICAgIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eGFwPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj4KICAgICAgICAgPHhhcDpDcmVhdG9yVG9vbD5BZG9iZSBGaXJld29ya3MgQ1MzPC94YXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4YXA6Q3JlYXRlRGF0ZT4yMDA5LTAzLTI3VDE1OjI4OjMxWjwveGFwOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4YXA6TW9kaWZ5RGF0ZT4yMDA5LTA5LTA4VDIzOjEzOjAxWjwveGFwOk1vZGlmeURhdGU+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICClEBX/AAAAkUlEQVQYGQXBvS5EARgFwDnnftmwkdCQ0CK8hPd/ARqVgkpDssnerN+ZPHwAgLP5fAYAd6Mb50frO3DIpPW6Hh0DzaS1Wm+w/9BMssAjTraSti1g1zajA7AZzaSB+/0vNJOM/Hm5jq+DZNKxfFufOLnUNE0uCnZJM+3idPP2+8N20UyWsL0FLJnMCoDJ9AoA5B8dhh0E/F+TWQAAAABJRU5ErkJggg==",
  bigIcon: "data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTM5jWRgMAAAAVdEVYdENyZWF0aW9uIFRpbWUAMjcvMy8wOeispIwAAAQRdEVYdFhNTDpjb20uYWRvYmUueG1wADw/eHBhY2tldCBiZWdpbj0iICAgIiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDQuMS1jMDM0IDQ2LjI3Mjk3NiwgU2F0IEphbiAyNyAyMDA3IDIyOjExOjQxICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4YXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPgogICAgICAgICA8eGFwOkNyZWF0b3JUb29sPkFkb2JlIEZpcmV3b3JrcyBDUzM8L3hhcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhhcDpDcmVhdGVEYXRlPjIwMDktMDMtMjdUMTU6Mjg6MzFaPC94YXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhhcDpNb2RpZnlEYXRlPjIwMDktMDktMDhUMjM6MTM6MDFaPC94YXA6TW9kaWZ5RGF0ZT4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIKUQFf8AAAmmSURBVGjetVoJV1XXFb7/Kb+hyaqxprWNbWqzoitJ21SNKGg0gkwiyCQgICIIgqLwGBRkFjAGHNGI8IwDUWJrdNmkbRrrrKffd97b1/3Ouw9cLbDW5x7Pns559x4eet4bb3hERlv7hs2HDk8n728wKQ0RbDhwwNKNUerrGw9YUK9twmsbQTmlodH30etmo0HxNzU1Tae3tqVI3fafzYcOdaU2t5jqk1+aY9dvmKFbM2Z45luLwZu3fN7Kt2Jl14e8wLW7uqGZmTh/LWsda+q88rWtcWuo1aDeLtvA1ta25M8ONpmO8BXTO/2NOYoGWsA3Ay1fX7W09eq1OOrqtN7VJfJLxIvcgoKbAcptQOeNadOHGtsnp+yOpoVCyR62d7p6bMz0wNiKgg9PhU0INBTl55JD0SaF1/RwOBwrB/gExWbhrl7QDPRjR3af+MJg8NPeuvr99tiEsKgJnTVHuyYv+F/kiC6c0Ffrff+psM/Ptq7j2nWcmLBJqqs3toH+b26apsuTmNgVi4OTkwg25cu+Hj60vZKnLGLsOo7iY+JMRtY1WTrpx9Xrg+KInYNhzWvr6oyXVF9vunF8Gi9fNk3oilMgtfJURCYvcpBfI4MqP98/LOsnIz7hcCymFMJhPw75g/66yzG1SM7uGzfQAHZgzb59+PBOm4aJy3YRqeAgduEVH7YysXf8oskYGDFr27vN6tYuSzMHR6xe1rzyj8S0U/dtU6bR6sKOfziwjqB6eOxZu7e6dp/pRgONSFB/acJS4QURHacxZSrPnjeZfcPmzMxfzcOnzwx/SClTX3X+gl2zX62fC7G5J+P0QejC54C1YwfqbDcN2K66ry7F0CBUjJ31C3d/qKdd++uYQXFZjNiC8getoY4NrKqpxQ5gG7rQQD22hai9+JXP01HLxMSdu2a2H9rdOORdWcfUoG2fYxd/TY9cvWpYu/dJ9V7TiW5qL1w0NUAdJxIFA9UoPenr/IivjiXQsV7XzjpcewfeEZ/srUEDNTXo5pqpxbRprB6/YHlC84KXKHAuJForukQ2124piheb1rPmP2P4dgfa8KmXSdsmzp03exSsHotIn798OSckTsx6YO/4eEwe1x7Eax9dk78Df6quNiE8nnafPWfB7oKo4BkKnAt8tL4u+AhO7T1uysZOx+WqUjVpG3nWbHeADbTh9bwHyip0VgkH8qTCCyg/efFyXvHj46dm9NZtk4FHcCma0LlcXtfEBj6u2mO8Dyt3m2Y8mspPn7HYjSaEEhVnzlpZ6CMkXQj8E40UnhjFhM/7tbg1aT6EY//HPdXG+7iqynaz69Rp251QgcjlUfrwxYsFA3dC8lagSLeWSgyROqIZj1MO3/twd5U5NDGB7Tvlo5zTBlyeePD8xYLhh8dPVM4zcfWwcJGb8Zb+CMP3VpZXmKZLl6yxZHTMxy5MQFPBT0i0UPgeDeh85EUu4+SVzKFz+N4H5eXmAJ6tpdHuir8ctbxL7TRAf3z2fMEw/t3dSK4omFtD6w7hCK3A8L0PdpVjByZMMX7XLAJKUKidAGhRVKfxLyRaCNx/9NjswTn3a3Dy70TRoica8YJbWVHJHagwDXhJFKNoouCLk4GUQcj/A8nmE/dQ+DlMvvr8eEwNLlw9a15RURE5QvvxXM3H75hF6JJUeIG2/YAb51ygX0FAjIKA2G5O4YNiaLDm98t2Ge99HKEGbEcBJpw3csJSF9SL7e8ocC7IOluEWu/GF92OqF6onbLj59ZRh2vJH0rL0AC62I/tyMciQe7wiKV5oLlRiP4+CpwLeWqNrMtzZKF+fE5d2XOd3K6eO7C8tNR4y8vK0M0Fk4cAPtBlztCw5Uk1f+/Jsznhrt3OBnR8BfG109Wyk9vV1eKN/PsSNPDezhK7HbkIsB0G0m3HhyzIa1A38+Chufvk6axI7x/010ssQc7QUFxMnc/1t3UND8fVw5qX8wj9tninqcUTIAdTIrIGj/u8yFp37u59cwf3ltmQO3TSX5MdXW9lDChbxbINJcjlr7dND8fYGYM1/27nTuxASYmpxms7cwBTgyMpHciLrGnP9E3zNxQ5G07duWeSOo6ZLb0D+LZiyK7V0LHd+BquTfuz5vd4hLgDe/ECyUKn6f0DcVR4Ab9Yuo1X/lwYv/897vMXzJae47P+PrCmrcukdPaatN7+mDyJ6hBahSvFMtTu/aawCN2cNel9/Ra2S+wAkQHnrVH91ih4/r599GTecP2n/+BLqlu20S09fX7u9Ghu8ppKLVW4VrxbVGS8ZcXFphKv5rTePh8ZaEKo5sU+gK+6Z5B8PnENjeQOn4zJwyYkd3pUz+Ips2YO33u3qNhuh3QsC4nUnl4L4YXyRcOE893EcXw5JnmCatByOa4Wy1C7tzS/wFRiO9JQ/OfdPTHU5bdgofD1eHvPdwOEzufmT+3rszJRNjpqlhYUGO/XhYWmHNux+Vi3RSp2QChBZ+HFR9CAa/h8NyC5dE5Lu7tjaijFfcgeoaUFhfYq/TmmK/is61gMqNvMzpVdaB2uIdfn6TiduH0nLn6ielgza/d+hSNUiu1ggRs7u3xYZ3YL/SZQ0WtZ1qQhYP/Nmf+rkWv/fmDy8YSTuG49WiZfhM+hPUJLduywd30Wm3K000J40o3RRgSuXfNbELgGb8hOfNd66rt7r/VBp08v/liRhSdLUMygmkh51f4lhu+9k7fDdsPOkjuOWGheZIEruzYXifQ6zuvkFaQcOWpt+SMjZklurvEW52y33UinxLr2Dp9PPnrUyuuxyLWRJ5KPvPIRu9jIr4/aXSTKGZSHOXRcXqmXYPje2zk59uwltbVbJ4KFkFInEJv20fqk9ngfN4b4u3yQbyK/9VFf3pw5fG/RthxcD0as4dPWNh/rUKDmBdrHtWmfRL6JYs+mj8uDHeCFcxGGjx3YblLx4eNTJwmGtcAa/CXc8pwAaJLSuVRD67hWy0H+2ubag/IJz88C70Qcvrc4L2/6I/yplW86Gle1hMynbW2WRvh2n18VeiVr/WpMiPD9FGLWO7LLC7TNpWwirb/frKytNazdW5JfkPw2Ps0bcIT4qt7YhWsunP6C/zuxBkUR5F1Z89a/pcX303a9XutZjKtnDFtkQB7uKD93LH4TPsyLc/PMO4WFyfY/eyzantv1cxylFeiKL6lUXJoycMZIifTBQStraB/XV3it1+sS+Vr7QPw64Tfg6KzAH/ZQL9Hl/28V4hfYibe25Uy/lZ1tfpaZaYRqUPdmVnaEZmaZN7MjvECvo13rImuzYny1zeVtjKz42Kxx8Y78ZKn7v/ylgOAwMLacAAAAAElFTkSuQmCC"
}

store = jetpack.storage.simple;
if (!store.lastId)
  store.lastId = 1;
queue = [];
jetpack.storage.live.history = [];
notifier = 0;
poller = 0;

jetpack.statusBar.append({
  html: '<img id="twitter-icon"><input type="checkbox">',
  onReady: function (doc) {
    $("img#twitter-icon", doc).attr("src", twitter.smallIcon);
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

jetpack.slideBar.append({
  icon: twitter.bigIcon,
  width: 500,
  onClick: function (slider) {
    $("ol", slider.contentDocument.body).empty();
    jetpack.storage.live.history.forEach(function (elem) {
      $("ol", slider.contentDocument.body).append('<li><span class="avatar"><a href="' +
        'http://twitter.com/' + elem.user.screen_name+'"><img height="48" width="48" src="' +
        elem.user.profile_image_url + '" alt="'+elem.user.name+'"/></a></span>' +
        '<span class="main"><strong><a title="'+elem.user.name+'" href="http://twitter.com/'+
        elem.user.screen_name+'">'+elem.user.screen_name+'</a> </strong><span>'+elem.text+
        '</span></span></li>');
    });
  },
  html: <>
    <style><![CDATA[
      * { margin:0; padding:0; text-align: left; }
      body { color: #666666; background: white; font-family:'Lucida Grande',sans-serif;
        font-size:0.75em; font-size-adjust:none; font-style:normal; font-variant:normal;
        font-weight:normal; line-height:normal; text-align:center; }
      img { height:48px; width:48px; border-color:transparent; border-width:0; }
      ol.tweets .avatar { display:block; height:50px; left:0; margin:0 10px 0 5px;
        overflow:hidden; position:absolute; width:50px; color: #666666; }
      ol.tweets span.main { display:block; margin-left:65px; min-height:50px; overflow:hidden;
        width:420px; color: #666666; }
      ol.tweets > li:first-child { border-top:1px dashed #D2DADA; }
      ol.tweets > li { border-bottom:1px dashed #D2DADA; line-height:1.1em;
        padding:0.7em 0 0.6em; position:relative; }
      ol.tweets { font-size:1.2em; list-style-image:none; list-style-position:outside;
        list-style-type:none; }
    ]]></style>
    <body>
      <ol class="tweets">
      </ol>
    </body>
  </>
});
