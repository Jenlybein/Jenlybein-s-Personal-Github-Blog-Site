"use strict";

import APlayer from 'aplayer';

console.log(
  "\n %c MetingJS v1.2.0 %c https://github.com/metowolf/MetingJS \n",
  "color: #fadfa3; background: #030307; padding:5px 0;",
  "background: #fadfa3; padding:5px 0;"
);
var aplayers = [],
  loadMeting = function () {
    function a(a, b) {
      var c = {
        container: a,
        audio: b,
        mini: null,
        fixed: null,
        autoplay: !1,
        mutex: !0,
        lrcType: 3,
        listFolded: !1,
        preload: "auto",
        theme: "#2980b9",
        loop: "all",
        order: "list",
        volume: null,
        listMaxHeight: null,
        customAudioType: null,
        storageName: "metingjs",
      };
      if (b.length) {
        b[0].lrc || (c.lrcType = 0);
        var d = {};
        for (var e in c) {
          var f = e.toLowerCase();
          (a.dataset.hasOwnProperty(f) ||
            a.dataset.hasOwnProperty(e) ||
            null !== c[e]) &&
            ((d[e] = a.dataset[f] || a.dataset[e] || c[e]),
            ("true" === d[e] || "false" === d[e]) && (d[e] = "true" == d[e]));
        }
        aplayers.push(new APlayer(d));
      }
    }
    var b =
      "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r";
    "undefined" != typeof meting_api && (b = meting_api);
    for (var f = 0; f < aplayers.length; f++)
      try {
        aplayers[f].destroy();
      } catch (a) {
        console.log(a);
      }
    aplayers = [];
    for (
      var c = document.querySelectorAll(".aplayer"),
        d = function () {
          var d = c[e],
            f = d.dataset.id;
          if (f) {
            var g = d.dataset.api || b;
            (g = g.replace(":server", d.dataset.server)),
              (g = g.replace(":type", d.dataset.type)),
              (g = g.replace(":id", d.dataset.id)),
              (g = g.replace(":auth", d.dataset.auth)),
              (g = g.replace(":r", Math.random()));
            var h = new XMLHttpRequest();
            (h.onreadystatechange = function () {
              if (
                4 === h.readyState &&
                ((200 <= h.status && 300 > h.status) || 304 === h.status)
              ) {
                var b = JSON.parse(h.responseText);
                a(d, b);
              }
            }),
              h.open("get", g, !0),
              h.send(null);
          } else if (d.dataset.url) {
            var i = [
              {
                name: d.dataset.name || d.dataset.title || "Audio name",
                artist: d.dataset.artist || d.dataset.author || "Audio artist",
                url: d.dataset.url,
                cover: d.dataset.cover || d.dataset.pic,
                lrc: d.dataset.lrc,
                type: d.dataset.type || "auto",
              },
            ];
            a(d, i);
          }
        },
        e = 0;
      e < c.length;
      e++
    )
      d();
  };
document.addEventListener("DOMContentLoaded", loadMeting, !1);
