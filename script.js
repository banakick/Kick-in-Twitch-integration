// ==UserScript==
// @name         bananirou Twitch/Kick Embed
// @version      7.7.7
// @description  Reemplaza el stream de twitch con el stream de kick, sin salir de twitch.tv/bananirou
// @author       LindYellow/lyndoon
// @match        *://*.twitch.tv/bananirou
// @match        *://twitch.tv/bananirou
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// ==/UserScript==

manualKickEmbed()

var fontawesome = document.createElement('script');

fontawesome.setAttribute('src','https://kit.fontawesome.com/45d4d8340f.js');
fontawesome.setAttribute('crossorigin','anonymous');

document.head.appendChild(fontawesome);

            function manualKickEmbed(){
                    (async function() {
                        'use strict';

                        console.info('[bananirou_twitch_embed] script initialized...');

                        //small startup delay, allow VOD element to become available for removal
                        const DELAY_SECS = 5;
                        await new Promise(sleep => setTimeout(sleep, DELAY_SECS * 1000));

                        //default for chat width
                        let ttv_chat_width_px = 250;

                        //find ttv containers for manipulation
                        let div_main = document.querySelector('main');
                        if(!div_main) {
                            console.info('[bananirou_twitch_embed] Error: No main container.');
                            return;
                        }

                        let div_container = div_main.parentElement;
                        if(!div_container) {
                            console.info('[bananirou_twitch_embed] Error: No parent container.');
                            return;
                        }

                        let div_sidebar = div_container.querySelector('div[class=""]');
                        let div_overlay = div_container.querySelector('div.celebration__overlay');
                        let div_nav = document.querySelector('nav.top-nav');
                        let div_bttv_nav = document.querySelector('div.bttv-side-nav');
                        let div_boton_chat = document.querySelector('.Layout-sc-1xcs6mc-0.kLMGYG.right-column__toggle-visibility.toggle-visibility__right-column.toggle-visibility__right-column--expanded');


                        //check if channel is live, if so exit early
                        if(document.querySelector('div.channel-root.channel-root--live')) {
                            console.info('[bananirou_twitch_embed] Info: Channel live on twitch. Exiting..');
                            return;
                        } else {
                            //add button to toggle kick frame
                            let btn_toggle = document.createElement('button');
                            btn_toggle.innerText = "KICK 🟩";
                            btn_toggle.innerHTML = '<i class="fa-brands fa-kickstarter fa-flip fa-xl" style="color: #26fd29;"></i>';
                            let inner_nav = div_nav.querySelector('div.top-nav__menu > div:last-child');
                            inner_nav.prepend(btn_toggle);

                            btn_toggle.addEventListener('click', async () => {
                                btn_toggle.remove();

                                    
                                let btn_toggle2 = document.createElement('button');
                                btn_toggle2.innerText = "TWITCH 💜";
                                btn_toggle2.innerHTML = '<i class="fa-brands fa-twitch fa-flip fa-xl" style="color: #B197FC;"></i>';
                                let inner_nav = div_nav.querySelector('div.top-nav__menu > div:last-child');
                                inner_nav.prepend(btn_toggle2);
                                btn_toggle2.addEventListener('click', async () => {location.reload();})
                                
                                //attempt to remove lingering VOD video (prevent audio playing in background)
                                let ttv_video = document.querySelector('video');
                                if (ttv_video) {
                                    if (ttv_video.volume) ttv_video.volume = 0;
                                    ttv_video.remove();
                                }

                                //remove default ttv divs
                                if(div_main) div_main.remove();
                                if(div_sidebar) div_sidebar.remove();
                                if(div_bttv_nav) div_bttv_nav.remove();
                                if(div_boton_chat) div_boton_chat.remove();
                                if(div_overlay) div_overlay.remove();

                                //create kick stream frame
                                let kick_frame = document.createElement('iframe');
                                kick_frame.src = "https://player.kick.com/bananirou";

                                //prepend kick stream before chat within parent container
                                div_container.prepend(kick_frame);

                                //wait for kick page to load and attempt to retrieve ttv chat width for kick page width margin
                                kick_frame.addEventListener('load', async () => {
                                    let chat_width = 0;

                                    //wait for ttv chat div to load / be available
                                    while(chat_width <= 0) {
                                        let chat_div = div_container.querySelector('div[id][style]');
                                        if(chat_div) {
                                            //use child element, chat root width if chat container width == 0
                                            chat_width = chat_div.clientWidth || 0;
                                            if(!chat_width) {
                                                let chat_root = chat_div.querySelector('div[class^="channel-root"]');
                                                if (chat_root) {
                                                    chat_width = chat_root.clientWidth || 0;
                                                }
                                            }

                                            //overwrite default width with found width
                                            if(chat_width > 0) {
                                                ttv_chat_width_px = chat_width;

                                                //attempt to remove lingering VOD video (prevent audio playing in background, though it should've already been removed inside the main container)
                                                let ttv_video = document.querySelector('video');
                                                if (ttv_video) {
                                                    if (ttv_video.volume) ttv_video.volume = 0;
                                                    ttv_video.remove();
                                                }

                                                break;
                                            }
                                        }

                                        //sleep thread while no chat div / chat width
                                        await new Promise(sleep => setTimeout(sleep, 500));
                                    }

                                    //set frame style
                                    let frame_style = `width: calc(100% - ${ttv_chat_width_px}px);`;
                                    kick_frame.setAttribute('style', frame_style);

                                });

                                //find chat elements for manipulation in case of chat already expanded
                                let div_chat = document.querySelector('.channel-root__right-column.channel-root__right-column--expanded');
                        
                                function manipulateChat(){
                                if (div_chat) {
                                    div_chat.style.transform = '';
                                    div_chat.style.transition = 'transform 500ms ease 0ms';
                                    div_chat.style.opacity = '1';
                                };
                                
                                if (div_boton_chat) {
                                div_boton_chat.classList.remove('toggle-visibility__right-column--expanded');
                                div_boton_chat.classList.add('Layout-sc-1xcs6mc-0 kLMGYG right-column__toggle-visibility toggle-visibility__right-column toggle-visibility__right-column--home toggle-visibility__right-column--expanded');
                                } return;
                                }
    
    
                            function cycleManipulateInterval() {
                                setInterval(manipulateChat, 250);}
    
                            cycleManipulateInterval() 

                            });
                        }

                    })();
        }

            function automaticKickEmbed(){
                
                    (async function() {
                        'use strict';

                        console.info('[bananirou_twitch_embed] script initialized...');

                        //small startup delay, allow VOD element to become available for removal
                        const DELAY_SECS = 8;
                        await new Promise(sleep => setTimeout(sleep, DELAY_SECS * 1000));

                        //default for chat width
                        let ttv_chat_width_px = 250;

                        //find ttv containers for manipulation
                        let div_main = document.querySelector('main');
                        if(!div_main) {
                            console.info('[bananirou_twitch_embed] Error: No main container.');
                            return;
                        }

                        let div_container = div_main.parentElement;
                        if(!div_container) {
                            console.info('[bananirou_twitch_embed] Error: No parent container.');
                            return;
                        }

                        let div_sidebar = div_container.querySelector('div[class=""]');
                        let div_overlay = div_container.querySelector('div.celebration__overlay');
                        let div_nav = document.querySelector('nav.top-nav');
                        let div_bttv_nav = document.querySelector('div.bttv-side-nav');
                        let div_boton_chat = document.querySelector('.Layout-sc-1xcs6mc-0.kLMGYG.right-column__toggle-visibility.toggle-visibility__right-column.toggle-visibility__right-column--expanded');



                        //check if channel is live, if so exit early
                        if(document.querySelector('div.channel-root.channel-root--live')) {
                            console.info('[bananirou_twitch_embed] Info: Channel live on twitch. Exiting..');
                            return;
                        }

                        //attempt to remove lingering VOD video (prevent audio playing in background, though it should've already been removed inside the main container)
                        let ttv_video = document.querySelector('video');
                        if (ttv_video) {
                            if (ttv_video.volume) ttv_video.volume = 0;
                            ttv_video.remove();
                        }

                        //remove default ttv divs
                        if(div_main) div_main.remove();
                        if(div_sidebar) div_sidebar.remove();
                        if(div_bttv_nav) div_bttv_nav.remove();
                        if(div_boton_chat) div_boton_chat.remove();
                        if(div_overlay) div_overlay.remove();

                        //create kick stream frame
                        let kick_frame = document.createElement('iframe');
                        kick_frame.src = "https://player.kick.com/bananirou";

                        //prepend kick stream before chat within parent container
                        div_container.prepend(kick_frame);

                        //wait for kick page to load and attempt to retrieve ttv chat width for kick page width margin
                        kick_frame.addEventListener('load', async () => {
                            let chat_width = 0;

                            //wait for ttv chat div to load / be available
                            while(chat_width <= 0) {
                                let chat_div = div_container.querySelector('div[id][style]');
                                if(chat_div) {
                                    //use child element, chat root width if chat container width == 0
                                    chat_width = chat_div.clientWidth || 0;
                                    if(!chat_width) {
                                        let chat_root = chat_div.querySelector('div[class^="channel-root"]');
                                        if (chat_root) {
                                            chat_width = chat_root.clientWidth || 0;
                                        }
                                    }

                                    //overwrite default width with found width
                                    if(chat_width > 0) {
                                        ttv_chat_width_px = chat_width;

                                        //attempt to remove lingering VOD video (prevent audio playing in background, though it should've already been removed inside the main container)
                                        let ttv_video = document.querySelector('video');
                                        if (ttv_video) {
                                            if (ttv_video.volume) ttv_video.volume = 0;
                                            ttv_video.remove();
                                        }

                                        break;
                                    }
                                }

                                //sleep thread while no chat div / chat width
                                await new Promise(sleep => setTimeout(sleep, 500));
                            }

                            //set frame style
                            let frame_style = `width: calc(100% - ${ttv_chat_width_px}px);`;
                            kick_frame.setAttribute('style', frame_style);

                        });
                            //find chat elements for manipulation in case of chat already expanded
                            let div_chat = document.querySelector('.channel-root__right-column.channel-root__right-column--expanded');
                            
                            function manipulateChat(){
                            if (div_chat) {
                                div_chat.style.transform = '';
                                div_chat.style.transition = 'transform 500ms ease 0ms';
                                div_chat.style.opacity = '1';
                            };
                            
                            if (div_boton_chat) {
                            div_boton_chat.classList.remove('toggle-visibility__right-column--expanded');
                            div_boton_chat.classList.add('Layout-sc-1xcs6mc-0 kLMGYG right-column__toggle-visibility toggle-visibility__right-column toggle-visibility__right-column--home toggle-visibility__right-column--expanded');
                            } return;
                            }


                        function cycleManipulateInterval() {
                            setInterval(manipulateChat, 250);}

                        cycleManipulateInterval() 

                    })();
        };
