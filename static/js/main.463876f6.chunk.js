(this.webpackJsonpavalon=this.webpackJsonpavalon||[]).push([[0],{30:function(e,t,n){e.exports=n(46)},35:function(e,t,n){},46:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(25),l=n.n(o),i=(n(35),n(8)),s=n.n(i),u=n(9),c=n(11),d=n(1),m=n(2),v=n(3),p=n(4),h=n(5),f=n(6),y=n(7),b=n(26),g=n.n(b),E=n(17),k=n.n(E);n(39);g.a.config();var j={apiKey:"AIzaSyAEz0EOh3rS5AQ1XyG4YQcHVtI9QvjbLQY",authDomain:"avalon-db-d62ad.firebaseapp.com",databaseURL:"https://avalon-db-d62ad.firebaseio.com",projectId:"avalon-db-d62ad",storageBucket:"avalon-db-d62ad.appspot.com",messagingSenderId:"964793644074",appId:"1:964793644074:web:1cce0c458aa896732fbf53",measurementId:"G-E2SERHMFE4"},O=new(function(){function e(){Object(m.a)(this,e),this.db=void 0,this.isOnline=!0,k.a.initializeApp(j),this.db=k.a.database()}return Object(v.a)(e,[{key:"getAllGames",value:function(){var e=Object(u.a)(s.a.mark((function e(){var t=this;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("fetching all game data"),e.abrupt("return",new Promise((function(e,n){t.db.ref("game").once("value",(function(t){var n=t.val();console.log("got all games:",n),e(Object.values(n||{}))}))})));case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"kickPlayer",value:function(){var e=Object(u.a)(s.a.mark((function e(t,n){var a,r,o,l,i;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=t.id,r=t.nominations,o=t.players,l=t.turn,i=t.votes,r.roster=(r.roster||[]).filter((function(e){return e!==n})),delete(r.tally||{})[n],delete(o||{})[n],l&&(l.order=l.order.filter((function(e){return e!==n})),l.current===n&&(l.current=l.order[0])),delete(i.tally||{})[n],e.next=8,this.updateNominations(a,r);case 8:return e.next=10,this.updatePlayers(a,o);case 10:return e.next=12,this.updateTurn(a,l);case 12:return e.next=14,this.updateVotes(a,i);case 14:case"end":return e.stop()}}),e,this)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"deleteAllGames",value:function(){this.db.ref("game").set({})}},{key:"updateGame",value:function(e){return console.log("saving data:",e),this.db.ref("game/".concat(e.id)).set(e)}},{key:"updateBoard",value:function(e,t){return this.db.ref("game/".concat(e,"/board")).set(t)}},{key:"updateNominations",value:function(e,t){return this.db.ref("game/".concat(e,"/nominations")).set(t)}},{key:"updatePlayers",value:function(e,t){return this.db.ref("game/".concat(e,"/players")).set(t)}},{key:"updateRoles",value:function(e,t){return this.db.ref("game/".concat(e,"/roles")).set(t)}},{key:"updateTurn",value:function(e,t){return this.db.ref("game/".concat(e,"/turn")).set(t||null)}},{key:"updateVetoes",value:function(e,t){return this.db.ref("game/".concat(e,"/vetoes")).set(t)}},{key:"updateVotes",value:function(e,t){return this.db.ref("game/".concat(e,"/votes")).set(t)}},{key:"getGameData",value:function(){var e=Object(u.a)(s.a.mark((function e(t){var n=this;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("fetching game data"),e.abrupt("return",new Promise((function(e,a){n.db.ref("game/".concat(t)).once("value",(function(t){var n=t.val();console.log("got game data:",n),e(n)}))})));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"joinGame",value:function(e,t){console.log("enabling hook:",e),this.db.ref("game/".concat(e)).on("value",(function(e){t(e.val())}))}},{key:"leaveGame",value:function(e){console.log("disabling hook:",e),this.db.ref("game/".concat(e)).off("value")}}]),e}()),w=function(e){Object(h.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(m.a)(this,n);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={games:[]},e}return Object(v.a)(n,[{key:"componentDidMount",value:function(){var e=this;O.getAllGames().then((function(t){return e.setState({games:t})}))}},{key:"render",value:function(){var e=this.state.games;return r.a.createElement("div",null,r.a.createElement("h1",null,"Debugging Health Info"),r.a.createElement("p",null,r.a.createElement("a",{href:"https://mpaulweeks.github.io/avalon/"},"mpaulweeks.github.io/avalon")),r.a.createElement("h3",null,"games"),e.map((function(e){return r.a.createElement("div",{key:e.id},e.id,Object.values(e.players).map((function(t){return r.a.createElement("span",{key:t.id,onClick:function(){return O.kickPlayer(e,t.id)}},"\xa0/ ",t.name)})))})),r.a.createElement("br",null),r.a.createElement("button",{onClick:function(){return O.deleteAllGames()}}," delete all "))}}]),n}(r.a.Component),R="loading",C="lobby",N="game",M="nominate",G="mission",S="setup",x="reset",F="debug",A="success",q="fail",B="approve",L="reject",P={Blue:"blue victory",Red:"red victory",Neutral:"neutral"},T=Object.values(P),V=["BasicBlue","Merlin","Percival","BasicRed","Assassin","Mordred","Morgana","Oberon"],I=V.reduce((function(e,t){return e[t]=t,e}),{}),H=[I.BasicRed,I.Assassin,I.Morgana,I.Mordred,I.Oberon],D=H.filter((function(e){return e!==I.Mordred})),J=H.filter((function(e){return e!==I.Oberon})),U={BasicBlue:{isRed:!1,name:"Basic Blue",description:"You know nothing. Good luck!",sees:[]},Merlin:{isRed:!1,name:"Merlin",description:"Those are the red players.",sees:D},Percival:{isRed:!1,name:"Percival",description:"You see two players. One is your ally Merlin, the other is the enemy Morgana. You must figure out which is which.",sees:[I.Merlin,I.Morgana]},BasicRed:{isRed:!0,name:"Basic Red",description:"They are your fellow Red players.",sees:J},Assassin:{isRed:!0,name:"Assassin",description:"They are your fellow Red players. You get to guess Merlin at the end of the game.",sees:J},Mordred:{isRed:!0,name:"Mordred",description:"They are your fellow Red players. Merlin cannot see you",sees:J},Morgana:{isRed:!0,name:"Morgana",description:"They are your fellow Red players. Percival sees you and Merlin. Try to confuse them.",sees:J},Oberon:{isRed:!0,name:"Oberon",description:"You cannot see your Red allies.",sees:[]}};function Y(){var e=Object(f.a)(["\n  font-size: 4rem;\n  margin: 0.2em;\n  width: 1.5em;\n  height: 1.5em;\n  border: 1px solid black;\n  border-radius: 2em;\n  cursor: pointer;\n\n  display: flex;\n  justify-content: center;\n  align-items: center;\n\n  user-select: none;\n\n  ","\n"]);return Y=function(){return e},e}function z(){var e=Object(f.a)([""]);return z=function(){return e},e}function Q(){var e=Object(f.a)(["\n  display: flex;\n  flex-direction: horizontal;\n  text-align: center;\n  flex-wrap: nowrap;\n"]);return Q=function(){return e},e}function K(){var e=Object(f.a)(["\n  border-color: purple;\n  background-color: plum;\n"]);return K=function(){return e},e}function X(){var e=Object(f.a)(["\n  margin: 1rem 0;\n  padding: 0.8rem;\n  border: 0.2rem solid green;\n"]);return X=function(){return e},e}function W(){var e=Object(f.a)(["\n  color: red;\n  font-weight: bold;\n"]);return W=function(){return e},e}function _(){var e=Object(f.a)(["\n  color: green;\n  font-weight: bold;\n"]);return _=function(){return e},e}var Z=y.a.span(_()),$=y.a.span(W()),ee=y.a.div(X()),te=Object(y.a)(ee)(K()),ne=y.a.div(Q()),ae=Object(y.a)(ne)(z()),re=y.a.div(Y(),(function(e){return"\n    ".concat(e.result===P.Neutral?"\n      color: black;\n      background-color: white;\n    ":"","\n    ").concat(e.result===P.Blue?"\n      color: white;\n      background-color: blue;\n    ":"","\n    ").concat(e.result===P.Red?"\n      color: white;\n      background-color: red;\n    ":"","\n  ")})),oe=window.location.href.includes("localhost"),le=window.location.href.includes("#d");if(!le){var ie=console.log;console.log=function(){},ie("activate debug move to view logs".toUpperCase())}function se(e,t){return function(e,t){return e.concat().sort((function(e,n){var a=t(e),r=t(n);return a<r?-1:a>r?1:0}))}(Object.values(e),t)}function ue(e){for(var t,n,a=e.concat(),r=a.length;0!==r;)n=Math.floor(Math.random()*r),t=a[r-=1],a[r]=a[n],a[n]=t;return a}function ce(e){var t=[{required:2,neededFails:1,result:P.Neutral},{required:3,neededFails:1,result:P.Neutral},{required:2,neededFails:1,result:P.Neutral},{required:3,neededFails:1,result:P.Neutral},{required:3,neededFails:1,result:P.Neutral}];return 6===e&&(t=[{required:2,neededFails:1,result:P.Neutral},{required:3,neededFails:1,result:P.Neutral},{required:4,neededFails:1,result:P.Neutral},{required:3,neededFails:1,result:P.Neutral},{required:4,neededFails:1,result:P.Neutral}]),7===e&&(t=[{required:2,neededFails:1,result:P.Neutral},{required:3,neededFails:1,result:P.Neutral},{required:3,neededFails:1,result:P.Neutral},{required:4,neededFails:2,result:P.Neutral},{required:4,neededFails:1,result:P.Neutral}]),e>=8&&(t=[{required:3,neededFails:1,result:P.Neutral},{required:4,neededFails:1,result:P.Neutral},{required:4,neededFails:1,result:P.Neutral},{required:5,neededFails:2,result:P.Neutral},{required:5,neededFails:1,result:P.Neutral}]),{vetos:0,missions:t}}var de=function(e){Object(h.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(m.a)(this,n);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).id=e.props.storage.id,e.state={},e}return Object(v.a)(n,[{key:"getMyRole",value:function(){var e=this.props,t=e.storage,n=e.data.players[t.id]||{name:t.name};return U[n.role||I.BasicBlue]}},{key:"voteSuccess",value:function(){var e=Object(d.a)({},this.props.data.votes);e.tally[this.id]=A,O.updateVotes(this.props.data.id,e)}},{key:"voteFail",value:function(){if(this.getMyRole().isRed){var e=Object(d.a)({},this.props.data.votes);e.tally[this.id]=q,O.updateVotes(this.props.data.id,e)}else alert("only red players can vote fail!")}},{key:"voteClear",value:function(){var e=Object(d.a)({},this.props.data.votes);e.tally={},O.updateVotes(this.props.data.id,e)}},{key:"toggleReveal",value:function(){var e=Object(d.a)({},this.props.data.votes);e.showResults=!e.showResults,O.updateVotes(this.props.data.id,e)}},{key:"render",value:function(){var e=this,t=this.props,n=t.isHost,a=t.data,o=a.nominations,l=a.players,i=a.votes,s=o.roster.includes(this.id),u=se(l,(function(e){return e.id})).filter((function(e){return o.roster.includes(e.id)&&!i.tally[e.id]}));return r.a.createElement("div",null,r.a.createElement("h1",null,"Mission Vote"),s?r.a.createElement("div",null,r.a.createElement("h3",null," cast your mission vote "),i.tally[this.id]?r.a.createElement("div",null," you have voted "):r.a.createElement("div",null,r.a.createElement("button",{onClick:function(){return e.voteSuccess()}},"vote SUCCESS"),r.a.createElement("button",{onClick:function(){return e.voteFail()}},"vote FAIL"))):r.a.createElement("div",null,"only nominated players can vote during the mission"),r.a.createElement("h3",null,"results!"),i.showResults&&Object.keys(i.tally).length?r.a.createElement("div",null,Object.values(i.tally).sort().reverse().map((function(e,t){return r.a.createElement("div",{key:t},e===A?r.a.createElement(Z,null,e.toUpperCase()):r.a.createElement($,null,e.toUpperCase()))}))):r.a.createElement("div",null,Object.keys(i.tally).length,"/",o.roster.length," votes counted",u.length?r.a.createElement("div",null,r.a.createElement("br",null),"waiting for:",u.map((function(e){return r.a.createElement("div",{key:e.id},e.name)}))):""),n&&r.a.createElement(te,null,r.a.createElement("button",{onClick:function(){return e.toggleReveal()}},i.showResults?"hide":"show"," votes"),r.a.createElement("button",{onClick:function(){return e.voteClear()}},"clear all votes")))}}]),n}(r.a.Component),me=n(15),ve=new(function(){function e(){Object(m.a)(this,e),this.store=window.localStorage,this.onSet=function(){return Promise.resolve()}}return Object(v.a)(e,[{key:"getMinor",value:function(e){return(e||"0.0.0").split(".").slice(0,2).join(".")}},{key:"reset",value:function(){this.set({v:"1.2.5",id:me.hri.random(),name:void 0,game:void 0,view:x})}},{key:"set",value:function(e){return this.store.setItem("state",JSON.stringify(e)),this.onSet(e)}},{key:"setName",value:function(e){return this.set(Object(d.a)({},this.get(),{name:e}))}},{key:"setGame",value:function(e){return this.set(Object(d.a)({},this.get(),{game:e}))}},{key:"setView",value:function(e){return this.set(Object(d.a)({},this.get(),{view:e}))}},{key:"get",value:function(){var e=this.store.getItem("state")||"{}",t=JSON.parse(e);return t&&this.getMinor(t.v)===this.getMinor("1.2.5")?t:(this.reset(),this.get())}}]),e}()),pe=function(e){Object(h.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(m.a)(this,n);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={tempName:oe?me.hri.random().split("-")[0]:"",tempJoin:""},e}return Object(v.a)(n,[{key:"setName",value:function(){ve.setName(this.state.tempName)}},{key:"render",value:function(){var e=this,t=this.props.storage,n=this.state,a=n.tempName,o=n.tempJoin;return t.name?r.a.createElement("div",null,r.a.createElement("h1",null,"Find a Game"),r.a.createElement("div",null,r.a.createElement("button",{onClick:function(){return e.props.createGame()}},"create new game")),r.a.createElement("h3",null,"or"),r.a.createElement("div",null,r.a.createElement("input",{value:o,onChange:function(t){return e.setState({tempJoin:t.target.value})},placeholder:"enter game id"}),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("button",{onClick:function(){return e.props.joinGame(o)}},"join game"))):r.a.createElement("div",null,r.a.createElement("h1",null,"Enter your name"),r.a.createElement("input",{value:a,onChange:function(t){return e.setState({tempName:t.target.value})}}),r.a.createElement("button",{onClick:function(){return e.setName()}},"confirm"))}}]),n}(r.a.Component),he=function(e){Object(h.a)(n,e);var t=Object(p.a)(n);function n(){return Object(m.a)(this,n),t.apply(this,arguments)}return Object(v.a)(n,[{key:"tryReset",value:function(){var e=!0;this.props.storage.game&&(e=window.confirm("Are you sure you want to reset?\nIf you leave a game in progress, you will not be able to rejoin.")),e&&this.props.reset()}},{key:"render",value:function(){var e=this,t=this.props.storage;return r.a.createElement("div",null,r.a.createElement("h1",null,"Current Local State"),r.a.createElement("pre",null,JSON.stringify(t,null,2)),r.a.createElement("div",null,r.a.createElement("button",{onClick:function(){return e.tryReset()}},"reset everything")))}}]),n}(r.a.Component),fe=function(e){Object(h.a)(n,e);var t=Object(p.a)(n);function n(){return Object(m.a)(this,n),t.apply(this,arguments)}return Object(v.a)(n,[{key:"nextTurn",value:function(){var e=this.props.data,t=e.id,n=e.turn,a=e.nominations,r=e.votes;if(n){var o=(n.order.indexOf(n.current)+1)%n.order.length,l=n.order[o];O.updateTurn(t,Object(d.a)({},n,{current:l})),O.updateNominations(t,Object(d.a)({},a,{roster:[],showResults:!1,tally:{}})),O.updateVotes(t,Object(d.a)({},r,{showResults:!1,tally:{}}))}}},{key:"missionChange",value:function(e){var t=this.props,n=t.isHost,a=t.data;if(n){var r=a.id,o=a.board,l=o.missions[e],i=(T.indexOf(l.result)+1)%T.length,s=T[i];l.result=s,O.updateBoard(r,o)}}},{key:"setMissionNoms",value:function(e){var t=this.props,n=t.isHost,a=t.data;if(n){var r=a.id,o=a.board;o.missions[e].roster=a.nominations.roster,O.updateBoard(r,o)}}},{key:"clearMissionNoms",value:function(e){var t=this.props,n=t.isHost,a=t.data;if(n){var r=a.id,o=a.board;o.missions[e].roster=null,O.updateBoard(r,o)}}},{key:"addVeto",value:function(e){var t=this.props,n=t.isHost,a=t.data;if(n){var r=a.id,o=a.vetoes;O.updateVetoes(r,o+e)}}},{key:"render",value:function(){var e=this,t=this.props,n=t.isHost,a=t.data,o=a.board,l=a.turn,i=a.players,s=a.vetoes,u=o.missions.some((function(e){return e.neededFails>1}));return r.a.createElement("div",null,r.a.createElement("h1",null,"Game #",a.id),l&&r.a.createElement("div",null,n&&r.a.createElement(te,null,r.a.createElement("button",{onClick:function(){return e.nextTurn()}},"Next Turn"))),r.a.createElement(ae,null,o.missions.map((function(t,a){return r.a.createElement("div",{key:a},r.a.createElement(re,{result:t.result,onClick:function(){return e.missionChange(a)}},t.required),u&&(t.neededFails>1?r.a.createElement("div",null,t.neededFails," fails needed"):r.a.createElement("br",null)),t.roster&&t.roster.map((function(e){return r.a.createElement("div",{key:e},i[e].name)})),n&&r.a.createElement(te,null,t.roster?r.a.createElement("button",{onClick:function(){return e.clearMissionNoms(a)}},"remove",r.a.createElement("br",null),"noms"):r.a.createElement("button",{onClick:function(){return e.setMissionNoms(a)}},"set",r.a.createElement("br",null),"noms")))}))),r.a.createElement("div",null,"Missions are played left to right. The number is how many people are required for each mission.",r.a.createElement("br",null),"It only takes 1 FAIL to win the mission for Red. First team to 3 missions wins."),r.a.createElement("h3",null,"Vetoes: ",s,"/4"),r.a.createElement("div",null,"When the number of vetoes reaches 4, the nomination automatically goes to mission without a group vote."),n&&r.a.createElement(te,null,r.a.createElement("button",{onClick:function(){return e.addVeto(1)}},"+"),r.a.createElement("button",{onClick:function(){return e.addVeto(-1)}},"-")))}}]),n}(r.a.Component),ye=n(10);function be(){var e=Object(f.a)(["\n  color: red;\n"]);return be=function(){return e},e}function ge(){var e=Object(f.a)(["\n  cursor: pointer;\n  text-decoration: underline;\n  color: red;\n"]);return ge=function(){return e},e}var Ee=y.a.span(ge()),ke=y.a.span(be()),je=function(e){Object(h.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(m.a)(this,n);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={},e}return Object(v.a)(n,[{key:"addRole",value:function(e){var t=Object(ye.a)(this.props.data.roles);t.push(e),t.sort(),O.updateRoles(this.props.data.id,t)}},{key:"removeRole",value:function(e){var t=Object(ye.a)(this.props.data.roles),n=t.findIndex((function(t){return t===e}));n>=0&&(t.splice(n,1),O.updateRoles(this.props.data.id,t))}},{key:"assign",value:function(){var e=this.props.data,t=e.id,n=e.players,a=e.roles;if(Object.keys(n).length!==a.length)return this.setState({errorMessage:"you need the same number of roles as players"});this.setState({errorMessage:void 0});var r=ue(Object.keys(n)),o=ue(a);r.forEach((function(e,t){n[e].role=o[t]})),O.updateBoard(t,ce(a.length)),O.updatePlayers(t,n),O.updateTurn(t,{current:r[0],order:r})}},{key:"clear",value:function(){var e=this.props.data,t=e.id,n=e.players;Object.keys(n).forEach((function(e,t){n[e].role=null})),O.updatePlayers(t,n),O.updateTurn(t,null)}},{key:"renderRoles",value:function(e,t){var n=this;return r.a.createElement("ul",null,e.map((function(e,a){return r.a.createElement("li",{key:a},t&&r.a.createElement(Ee,{onClick:function(){return n.removeRole(e)}},"X"),U[e].name)})))}},{key:"renderAdd",value:function(e){var t=this;return r.a.createElement("div",null,e.map((function(e,n){return r.a.createElement("button",{key:n,onClick:function(){return t.addRole(e)}},U[e].name)})))}},{key:"render",value:function(){var e=this,t=this.props,n=t.isHost,a=t.data,o=this.state.errorMessage,l=Object.values(a.players).some((function(e){return e.role})),i=n&&!l,s=Object.values(a.roles).filter((function(e){return U[e].isRed})),u=Object.values(a.roles).filter((function(e){return!U[e].isRed})),c=se(a.players,(function(e){return e.name}));return r.a.createElement("div",null,r.a.createElement("h1",null,"Setup"),r.a.createElement("h3",null,"Players: ",c.length),r.a.createElement("div",null,c.map((function(e){return e.name})).join(", ")),n&&r.a.createElement(te,null,l?r.a.createElement("div",null,r.a.createElement("button",{onClick:function(){return e.clear()}},"CLEAR ROLES (reset game)")):r.a.createElement("div",null,this.renderAdd(V.filter((function(e){return U[e].isRed}))),r.a.createElement("br",null),this.renderAdd(V.filter((function(e){return!U[e].isRed}))),r.a.createElement("br",null),r.a.createElement("button",{onClick:function(){return e.assign()}},"ASSIGN ROLES"),o&&r.a.createElement(ke,null,o))),r.a.createElement("h3",null,"Red Roles (",s.length,")"),this.renderRoles(s,i),r.a.createElement("h3",null,"Blue Roles (",u.length,")"),this.renderRoles(u,i),n&&r.a.createElement(te,null,r.a.createElement("h3",null,"Kick Player"),r.a.createElement("p",null,"Mostly an emergency tool if someone resets their info.",r.a.createElement("br",null),"If the player refreshes without resetting their info, they will rejoin."),c.map((function(e){return r.a.createElement("button",{key:e.id,onClick:function(){return O.kickPlayer(a,e.id)}},e.name)}))))}}]),n}(r.a.Component);function Oe(){var e=Object(f.a)(["\n  border-color: black;\n  background-color: #eeeeee;\n\n  & span {\n    margin: 0 0.1em;\n  }\n"]);return Oe=function(){return e},e}function we(){var e=Object(f.a)(["\n  background-color: black;\n  color: white;\n  border-color: red;\n"]);return we=function(){return e},e}var Re=Object(y.a)(ee)(we()),Ce=Object(y.a)(ee)(Oe()),Ne=function(e){Object(h.a)(n,e);var t=Object(p.a)(n);function n(){return Object(m.a)(this,n),t.apply(this,arguments)}return Object(v.a)(n,[{key:"render",value:function(){var e=this.props,t=e.storage,n=e.data,a=n.players[t.id]||{name:t.name},o=U[a.role||I.BasicBlue],l=Object.keys(n.players).filter((function(e){return e!==t.id})).map((function(e){return n.players[e]})).filter((function(e){return e.role&&o.sees.includes(e.role)})).map((function(e){return e.name})),i=n.nominations.roster.length>0?n.nominations.roster.map((function(e){return n.players[e].name})).join(", "):"(nobody)",s=n.turn?n.turn.order:Object.keys(n.players).sort();return r.a.createElement("div",null,r.a.createElement(Re,null,r.a.createElement("div",null,r.a.createElement("u",null,"secret info! do not discuss what's in this box!")),a.role?r.a.createElement("div",null,"you are: ",r.a.createElement("b",null,o.name),". you see: ",r.a.createElement("b",null,l.join(", ")||"(nobody)"),r.a.createElement("br",null),o.description):r.a.createElement("div",null,"roles haven't been assigned yet")),r.a.createElement(Ce,null,r.a.createElement("div",null,"turn order: ",s.map((function(e,t,a){var o=n.players[e],l=(o?o.name:"???")+(t<a.length-1?",":""),i={color:e===n.host?"purple":"black",textDecoration:n.turn&&e===n.turn.current?"underline":"none"};return r.a.createElement("span",{key:e,style:i},l)}))),r.a.createElement("div",null,"nomination: ",i)))}}]),n}(r.a.Component),Me=function(e){Object(h.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(m.a)(this,n);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).id=e.props.storage.id,e.state={},e}return Object(v.a)(n,[{key:"voteSuccess",value:function(){var e=Object(d.a)({},this.props.data.nominations);e.tally[this.id]=B,O.updateNominations(this.props.data.id,e)}},{key:"voteFail",value:function(){var e=Object(d.a)({},this.props.data.nominations);e.tally[this.id]=L,O.updateNominations(this.props.data.id,e)}},{key:"voteClear",value:function(){var e=Object(d.a)({},this.props.data.nominations);e.tally={},O.updateNominations(this.props.data.id,e)}},{key:"toggleReveal",value:function(){var e=Object(d.a)({},this.props.data.nominations);e.showResults=!e.showResults,O.updateNominations(this.props.data.id,e)}},{key:"addToRoster",value:function(e){var t=this.props.data.nominations,n=Object(ye.a)(t.roster);n.push(e),n.sort(),O.updateNominations(this.props.data.id,Object(d.a)({},t,{roster:n}))}},{key:"removeFromRoster",value:function(e){var t=this.props.data.nominations,n=Object(ye.a)(t.roster),a=n.findIndex((function(t){return t===e}));a>=0&&(n.splice(a,1),O.updateNominations(this.props.data.id,Object(d.a)({},t,{roster:n})))}},{key:"render",value:function(){var e=this,t=this.props,n=t.isHost,a=t.data,o=a.nominations,l=a.players,i=a.turn&&a.turn.current===this.id&&!o.showResults,s=se(l,(function(e){return e.id})),u=s.filter((function(e){return!o.roster.includes(e.id)})),c=Object.keys(o.tally).sort(),d=s.filter((function(e){return!o.tally[e.id]})),m=a.board.missions.filter((function(e){return e.result===P.Neutral}))[0],v=m?m.required:"???";return r.a.createElement("div",null,r.a.createElement("h1",null,"Nominate for Mission"),r.a.createElement("div",null,"This mission requires ",v," people."),r.a.createElement("h3",null,"Nominated:"),r.a.createElement("div",null,o.roster.length?i?o.roster.map((function(t,n){return r.a.createElement("button",{key:n,onClick:function(){return e.removeFromRoster(t)}},l[t].name)})):o.roster.map((function(e){return l[e].name})).join(", "):"nobody has been nominated yet"),i&&r.a.createElement("div",null,r.a.createElement("h3",null,"Not Nominated:"),r.a.createElement("div",null,u.length>0?u.map((function(t,n){return r.a.createElement("button",{key:n,onClick:function(){return e.addToRoster(t.id)}},t.name)})):"everyone has been nominated")),r.a.createElement("h3",null,"cast your vote for who goes on the mission"),o.tally[this.id]&&r.a.createElement("div",null,r.a.createElement("div",null," you have voted ")),!o.showResults&&r.a.createElement("div",null,r.a.createElement("button",{onClick:function(){return e.voteSuccess()}},"vote SUPPORT"),r.a.createElement("button",{onClick:function(){return e.voteFail()}},"vote REJECT")),n&&r.a.createElement(te,null,r.a.createElement("button",{onClick:function(){return e.toggleReveal()}},o.showResults?"hide":"show"," votes"),r.a.createElement("button",{onClick:function(){return e.voteClear()}},"clear all votes")),r.a.createElement("h3",null,"results!"),o.showResults&&Object.keys(o.tally).length?r.a.createElement("div",null,c.map((function(e,t){return r.a.createElement("div",{key:t},a.players[e].name,":\xa0",o.tally[e]===B?r.a.createElement(Z,null,o.tally[e].toUpperCase()):r.a.createElement($,null,o.tally[e].toUpperCase()))}))):r.a.createElement("div",null,Object.keys(o.tally).length,"/",Object.keys(l).length," votes counted",d.length?r.a.createElement("div",null,r.a.createElement("br",null),"waiting for:",d.map((function(e){return r.a.createElement("div",{key:e.id},e.name)}))):""))}}]),n}(r.a.Component);function Ge(){var e=Object(f.a)(["\n  margin: 0 0.5em;\n  margin-top: 0;\n  border-color: #00000000;\n  border-top-width: 0;\n  & a {\n    color: inherit;\n  }\n\n  ","\n\n  ","\n\n  &:first-child {\n    margin-left: 0;\n  }\n"]);return Ge=function(){return e},e}var Se=Object(y.a)(ee)(Ge(),(function(e){return e.hasLink?"\n    & span {\n      cursor: pointer;\n      text-decoration: underline;\n    }\n  ":""}),(function(e){return e.current?"\n    border-color: grey;\n  ":""})),xe=function(e){Object(h.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(m.a)(this,n);for(var a=arguments.length,o=new Array(a),l=0;l<a;l++)o[l]=arguments[l];return(e=t.call.apply(t,[this].concat(o))).state={storage:ve.get()},e.Link=function(t){var n=t.type,a=n?function(){return ve.setView(n)}:function(){};return r.a.createElement(Se,{current:n===e.state.storage.view,hasLink:!!n,onClick:a},r.a.createElement("span",null,t.children))},e}return Object(v.a)(n,[{key:"componentDidMount",value:function(){var e=this;ve.onSet=function(t){return new Promise((function(n,a){e.setState({storage:t},n)}))};var t=this.state.storage;t.name&&t.game?this.join(this.genGuestGameData()):ve.setView(C)}},{key:"genHostGameData",value:function(){var e=this.state.storage.id;return Object(d.a)({},this.genGuestGameData(),{host:e})}},{key:"genGuestGameData",value:function(){var e=this.state.storage,t=e.id,n=e.name,a=e.game;if(!a)throw new Error("game should be set in localStorage");return{id:a,host:void 0,board:ce(7),nominations:{showResults:!1,roster:[],tally:{}},roles:[],players:Object(c.a)({},t,{id:t,name:n||"???"}),turn:null,vetoes:0,votes:{showResults:!1,tally:{}}}}},{key:"join",value:function(){var e=Object(u.a)(s.a.mark((function e(t){var n,a,r,o,l,i,u=this;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=this.state.storage,!t.host){e.next=5;break}O.updateGame(t),e.next=16;break;case 5:return e.next=7,O.getGameData(t.id);case 7:if(a=e.sent){e.next=11;break}return this.reset(),e.abrupt("return");case 11:r=n.id,o=t.players[r],l=a.players[r]||{},i=Object(d.a)({},a.players,Object(c.a)({},r,Object(d.a)({},o,{},l,{name:o.name}))),O.updatePlayers(t.id,i);case 16:n.view===C&&ve.setView(N),O.joinGame(t.id,(function(e){return u.onReceive(e)}));case 18:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"onReceive",value:function(e){console.log("received:",e),this.setState({data:Object(d.a)({roles:[],turn:null},e,{nominations:Object(d.a)({roster:[],tally:{}},e.nominations),votes:Object(d.a)({tally:{}},e.votes)})})}},{key:"createGame",value:function(){var e=Object(u.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ve.setGame((t=3,Math.floor(Math.random()*Math.pow(10,t)).toString().padStart(t,"0")));case 2:this.join(this.genHostGameData());case 3:case"end":return e.stop()}var t}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"joinGame",value:function(){var e=Object(u.a)(s.a.mark((function e(t){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ve.setGame(t);case 2:this.join(this.genGuestGameData());case 3:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"reset",value:function(){var e=this.state.storage;e.game&&O.leaveGame(e.game),ve.reset(),this.setState({data:void 0})}},{key:"renderMain",value:function(){var e=this,t=this.state,n=t.storage,a=t.data,o=n.id,l=n.view,i=!!a&&o===a.host;return l===N&&a?r.a.createElement(fe,{isHost:i,data:a,storage:n}):l===S&&a?r.a.createElement(je,{isHost:i,data:a,storage:n}):l===M&&a?r.a.createElement(Me,{isHost:i,data:a,storage:n}):l===G&&a?r.a.createElement(de,{isHost:i,data:a,storage:n}):l!==C||a?l===x?r.a.createElement(he,{storage:n,reset:function(){return e.reset()}}):l===F?r.a.createElement(w,null):l===R?r.a.createElement("h3",null,"connecting to server, please wait..."):r.a.createElement("div",null,r.a.createElement("h3",null,"you have reached an invalid state :("),r.a.createElement("div",null,"view: ",l),r.a.createElement("div",null,"data: ",!!a),r.a.createElement("h3",null,"please try refreshing and/or reset your local state")):r.a.createElement(pe,{storage:n,createGame:function(){return e.createGame()},joinGame:function(t){return e.joinGame(t)}})}},{key:"render",value:function(){var e=this.state,t=e.storage,n=e.data;return r.a.createElement("div",null,r.a.createElement("nav",null,r.a.createElement("ul",null,n&&r.a.createElement(this.Link,{type:N},"Game #",n.id),n&&r.a.createElement(this.Link,{type:M},"Nominate"),n&&r.a.createElement(this.Link,{type:G},"Mission"),n&&r.a.createElement(this.Link,{type:S},"Setup"),!n&&r.a.createElement(this.Link,{type:C},"Lobby"),r.a.createElement(this.Link,{type:x},"Reset"),le&&r.a.createElement(this.Link,{type:F},"Debug"),r.a.createElement(this.Link,null,r.a.createElement("a",{target:"_blank",href:"rules.pdf"},"Rules")),r.a.createElement(this.Link,null,"v.","1.2.5"))),n&&r.a.createElement(Ne,{data:n,storage:t}),this.renderMain())}}]),n}(r.a.Component);l.a.render(r.a.createElement(xe,null),document.getElementById("root"))}},[[30,1,2]]]);
//# sourceMappingURL=main.463876f6.chunk.js.map