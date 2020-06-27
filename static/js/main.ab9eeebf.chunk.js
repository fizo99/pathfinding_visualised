(this.webpackJsonpdijkstra=this.webpackJsonpdijkstra||[]).push([[0],{13:function(t,e,n){},14:function(t,e,n){},15:function(t,e,n){"use strict";n.r(e);var a=n(0),i=n.n(a),r=n(6),c=n.n(r),s=n(7),o=n(1),l=n(2),u=n(4),f=n(3),d=(n(13),n(14),function(t){Object(u.a)(n,t);var e=Object(f.a)(n);function n(){return Object(o.a)(this,n),e.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){var t=this.props,e=t.col,n=t.row,a=t.isFinish,r=t.isStart,c=t.isWall,s=t.isPath,o=t.isVisited,l="cell";return c?l+=" wall":o?l+=" visited":s?l+=" path":a?l+=" finish":r&&(l+=" start"),i.a.createElement("div",{className:l,id:"".concat(n,"-").concat(e)})}}]),n}(i.a.Component)),h=!1,v=function(t){Object(u.a)(n,t);var e=Object(f.a)(n);function n(){var t;return Object(o.a)(this,n),(t=e.call(this)).generateMaze=function(){var e=w();t.setState({grid:e}),h=!1},t.findPath=function(){var e=t.state.grid;if(!h){var n=e[10][10],a=e[10][40],i=m(e,n,a);t.animateDijkstra(i),h=!0}},t.animateDijkstra=function(e){for(var n=t.state.grid,a=function(a){if(a===e.length-1)return setTimeout((function(){t.animatePath()}),10*a),{v:void 0};var i=e[a].row,r=e[a].col;if(10===i&&10===r||10===i&&40===r)return"continue";setTimeout((function(){n[i][r].isVisited=!0,document.getElementById("".concat(i,"-").concat(r)).className="cell visited"}),10*a)},i=0;i<e.length;i++){var r=a(i);switch(r){case"continue":continue;default:if("object"===typeof r)return r.v}}},t.animatePath=function(){for(var e=t.state.grid,n=e[10][40],a=[];null!==n;)a.push(n),n=n.previousCell;for(var i=function(t){var n=a[t].row,i=a[t].col;if(10===n&&10===i||10===n&&40===i)return"continue";setTimeout((function(){e[n][i].isPath=!0,document.getElementById("".concat(n,"-").concat(i)).className="cell path"}),10*t)},r=0;r<a.length;r++)i(r)},t.state={grid:[]},t}return Object(l.a)(n,[{key:"componentDidMount",value:function(){var t=N();this.setState({grid:t})}},{key:"render",value:function(){var t=this.state.grid;return i.a.createElement("main",null,i.a.createElement("h1",null,"Dijkstra algorithm visualisation"),i.a.createElement("div",{className:"menu"},i.a.createElement("button",{onClick:this.findPath},"Find Path"),i.a.createElement("button",{onClick:this.generateMaze},"Generate Maze")),i.a.createElement("div",{className:"grid",id:"grid"},t.map((function(t,e){return i.a.createElement("div",{key:e,className:"row"},t.map((function(t,e){var n=t.row,a=t.col,r=t.isStart,c=t.isFinish,s=t.isWall,o=t.isVisited,l=t.isPath;return i.a.createElement(d,{key:e,row:n,col:a,isStart:r,isFinish:c,isWall:s,isVisited:o,isPath:l})})))}))))}}]),n}(i.a.Component),m=function(t,e,n){var a=[];e.distance=0;for(var i=E(t);i.length;){i.sort((function(t,e){return t.distance-e.distance}));var r=i.shift();if(!r.isWall){if(r.distance===1/0)return a;if(r.isVisited=!0,a.push(r),r===n)return a;p(r,t)}}},p=function(t,e){var n,a=g(t,e).filter((function(t){return!t.isVisited})),i=Object(s.a)(a);try{for(i.s();!(n=i.n()).done;){var r=n.value;r.distance=t.distance+1,r.previousCell=t}}catch(c){i.e(c)}finally{i.f()}},g=function(t,e){var n=[],a=t.col,i=t.row;return a-1>=0&&n.push(e[i][a-1]),a+1<50&&n.push(e[i][a+1]),i+1<20&&n.push(e[i+1][a]),i-1>=0&&n.push(e[i-1][a]),n},E=function(t){for(var e=[],n=0;n<20;n++)for(var a=0;a<50;a++)e.push(t[n][a]);return e},w=function(){for(var t=N(),e=0;e<20;e++)for(var n=0;n<50;n++)t[e][n].isWall=!0,t[e][n].isVisited=!1,t[e][n].isPath=!1;var a=t[10][10],i=[];i.push(a);for(var r=b(a,t);r.length>0;){var c=k(0,r.length-1),s=r.splice(c,1)[0],o=b(s,t).filter((function(t){return i.includes(t)}));if(o.length>0){var l=o[k(0,o.length-1)],u=y(l,s,t);i.push(u),i.push(s),u.isWall=!1,s.isWall=!1}for(var f=b(s,t).filter((function(t){return t.isWall})),d=0;d<f.length;d++)r.includes(f[d])||r.push(f[d])}for(var h=0;h<i.length;h++){var v=i[h].row,m=i[h].col;10!==v||10!==m?10!==v||40!==m?(t[v][m].isWall=!1,document.getElementById("".concat(v,"-").concat(m)).className="cell"):document.getElementById("".concat(v,"-").concat(m)).className="cell finish":document.getElementById("".concat(v,"-").concat(m)).className="cell start"}for(var p=0;p<50;p++){t[0][p].isWall=!0;var g=t[0][p].row,E=t[0][p].col;document.getElementById("".concat(g,"-").concat(E)).className="cell wall"}for(var w=0;w<20;w++){t[w][0].isWall=!0;var j=t[w][0].row,W=t[w][0].col;document.getElementById("".concat(j,"-").concat(W)).className="cell wall"}return t},y=function(t,e,n){var a=t.row,i=t.col,r=e.row,c=e.col;return a===r?n[a][j(i,c)-1]:i===c?n[j(a,r)-1][i]:void 0};function j(t,e){return t>=e?t:e}var b=function(t,e){var n=[],a=t.col,i=t.row;return a-2>=0&&n.push(e[i][a-2]),a+2<50&&n.push(e[i][a+2]),i+2<20&&n.push(e[i+2][a]),i-2>=0&&n.push(e[i-2][a]),n};function k(t,e){return t+Math.floor((e-t)*Math.random())}var N=function(){for(var t=[],e=0;e<20;e++){for(var n=[],a=0;a<50;a++)n.push(W(e,a));t.push(n)}return t},W=function(t,e){return{row:t,col:e,isStart:10===t&&10===e,isFinish:10===t&&40===e,isWall:!1,previousCell:null,distance:1/0,isVisited:!1,isPath:!1}},P=v;var O=function(){return i.a.createElement("div",{className:"App"},i.a.createElement(P,null))};c.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(O,null)),document.getElementById("root"))},8:function(t,e,n){t.exports=n(15)}},[[8,1,2]]]);
//# sourceMappingURL=main.ab9eeebf.chunk.js.map