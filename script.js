// ==UserScript==
// @name         Twitch/Kick Embed
// @version      77.7
// @description  Reemplaza el stream de twitch con el stream de kick, sin salir de twitch.tv
// @author       LindYellow/mkze
// @match        *://*.twitch.tv/
// @match        *://twitch.tv/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// ==/UserScript==

const streamerChannels = {
    "bananirou": {
        twitch: "https://www.twitch.tv/bananirou",
        kick: "bananirou"
    },
    "xqc": {
        twitch: "https://www.twitch.tv/xqc",
        kick: "xqc"
    },
    "momoladinastia": {
        twitch: "https://www.twitch.tv/momoladinastia",
        kick: "momoladinastia"
    },
    "agusbob": {
        twitch: "https://www.twitch.tv/agusbob",
        kick: "agusbob"
    },
    "coscu": {
        twitch: "https://www.twitch.tv/coscu",
        kick: "coscu"
    },
    "antonicratv": {
        twitch: "https://www.twitch.tv/antonicratv",
        kick: "antonicratv"
    },
    "brunenger": {
        twitch: "https://www.twitch.tv/brunenger",
        kick: "brunenger"
    }
    //add more streamers here
};

//language settings
function getTranslation(key) {
    const lang = getLanguage().slice(0, 2); //get the first 2 characters of the language
    const translations = {
        en: {
            'btn_toggle_main': 'Go to KICK',
            'btn_toggle_1': 'Loading KICK Stream',
            'btn_toggle_2': 'Go to KICK Stream',
            'btn_toggle2': 'Return to TWITCH',
            'btn_toggle_main.width': '85px',
            'btn_toggle_1.width': '160px',
            'btn_toggle_2.width': '130px',
            'btn_toggle2.width': '130px',
            'btn_toggle_main.margin-left': '-50px',
            'btn_toggle_1.margin-left': '-80px',
            'btn_toggle_2.margin-left': '-65px',
            'btn_toggle2.margin-left': '-65px',
        },
        es: {
            'btn_toggle_main': 'Ir a KICK',
            'btn_toggle_1': 'Cargando Stream de KICK',
            'btn_toggle_2': 'Ir al Stream de KICK',
            'btn_toggle2': 'Volver a TWITCH',
            'btn_toggle_main.width': '70px',
            'btn_toggle_1.width': '180px',
            'btn_toggle_2.width': '150px',
            'btn_toggle2.width': '120px',
            'btn_toggle_main.margin-left': '-35px',
            'btn_toggle_1.margin-left': '-90px',
            'btn_toggle_2.margin-left': '-75px',
            'btn_toggle2.margin-left': '-60px',
        }
    };

    //if the language is not English or Spanish, upload the data in English
    if (lang !== 'en' && lang !== 'es') {
        return translations['en'][key] || key;
    }

    return translations[lang][key] || key;
}
(async function() {
    let btn_toggle = null;
    let btn_toggle_main = null
    let streamerName = null


    //default for chat width
    let ttv_chat_width_px = 250;

    //find ttv containers for manipulation
    let div_other = document.querySelector('div.Layout-sc-1xcs6mc-0.ebXXcv');
    let div_searchbar = document.querySelector('div.Layout-sc-1xcs6mc-0.kuGBVB');
    let div_delay = document.querySelector('div.lleBanner');
    let div_main = document.querySelector('main');
    let div_container = div_main.parentElement;
    let div_sidebar = div_container.querySelector('div[class=""]');
    let div_overlay = div_container.querySelector('div.celebration__overlay');
    let div_nav = document.querySelector('nav.top-nav');
    let div_bttv_nav = document.querySelector('div.bttv-side-nav');
    let div_boton_chat = document.querySelector('.Layout-sc-1xcs6mc-0.kLMGYG.right-column__toggle-visibility.toggle-visibility__right-column.toggle-visibility__right-column--expanded');
    cycleFunctions()


    async function checkURL() {
        
        const currentURL = window.location.href;  
        const streamerInfo = Object.values(streamerChannels).find(streamer => streamer.twitch === currentURL);

        if (streamerInfo) {
            streamerName = streamerInfo.kick;

            if (btn_toggle===null) {  //add button to toggle kick frame


                btn_toggle = document.createElement('button');
                btn_toggle.innerText = "KICK 🟩";
                btn_toggle.innerHTML = createBtn_toggle(1);
                let inner_nav = div_nav.querySelector('div.top-nav__menu > div:last-child');
                inner_nav.prepend(btn_toggle);
                btn_toggle.style.marginTop = '6px'; 
                btn_toggle.style.marginRight = '2px'; 
                btn_toggle.style.padding = '4px 8px'; 
                

                //small startup delay, allow VOD element to become available for removal
                const DELAY_SECS = 8;
                await new Promise(sleep => setTimeout(sleep, DELAY_SECS * 1000));
            
                    btn_toggle.innerHTML = createBtn_toggle(2);
                    btn_toggle.addEventListener('click', async () => {
                    btn_toggle.remove();

                    //add button to toggle twitch refresh
                    let btn_toggle2 = document.createElement('button');
                    btn_toggle2.innerText = "TWITCH 💜";
                    btn_toggle2.innerHTML = createBtn_toggle2();
                    let inner_nav = div_nav.querySelector('div.top-nav__menu > div:last-child');
                    inner_nav.prepend(btn_toggle2);
                    btn_toggle2.style.marginTop = '6px'; 
                    btn_toggle2.style.marginRight = '2px'; 
                    btn_toggle2.style.padding = '4px 8px'; 
                    btn_toggle2.addEventListener('click', async () => {location.reload();})

                    //remove default ttv divs
                    if(div_main) div_main.remove();
                    if(div_sidebar) div_sidebar.remove();
                    if(div_bttv_nav) div_bttv_nav.remove();
                    if(div_boton_chat) div_boton_chat.remove();
                    if(div_overlay) div_overlay.remove();
                    if(div_delay) div_delay.remove();
                    if(div_searchbar) div_searchbar.remove();
                    if(div_other) div_other.remove();

                    //create kick stream frame
                    let kick_frame = document.createElement('iframe');
                    kick_frame.src = "https://player.kick.com/" + streamerName + "?muted=false";

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

                    //find chat elements if it is extended
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

                })}} else {
                        // remove btn_toggle button if it exists
                        if (btn_toggle) {
                            btn_toggle.remove();
                            btn_toggle = null;
                        }}  }  
            function handleMainPage() {
                const currentURL = window.location.href;
                if (currentURL === "https://www.twitch.tv/") {
                    if (btn_toggle_main === null) {
                        btn_toggle_main = document.createElement('button');
                        btn_toggle_main.innerText = "KICK 🟩";
                        btn_toggle_main.innerHTML = createBtn_toggle_main();
                        let inner_nav = div_nav.querySelector('div.top-nav__menu > div:last-child');
                        inner_nav.prepend(btn_toggle_main);
                        btn_toggle_main.style.marginTop = '6px'; 
                        btn_toggle_main.style.marginRight = '2px'; 
                        btn_toggle_main.style.padding = '4px 8px';
                        btn_toggle_main.addEventListener('click', () => {
                            window.location.href = "https://kick.com";
                        });
                    }
                } else {
                    if (btn_toggle_main) {
                        btn_toggle_main.remove();
                        btn_toggle_main = null;
                    }
                }
            }                      
                        function cycleFunctions() {
                        setInterval(checkURL, 1000);
                        setInterval(handleMainPage, 1000);};
})();

function getLanguage() {
    return navigator.language || navigator.userLanguage;
}

function getCommonButtonStyles() {
    return `
        <style>
          .tooltip {
            position: relative;
            display: inline-block;
          }
          .tooltip .tooltiptext {
            visibility: hidden;
            background-color: white;
            color: black;
            text-align: center;
            border-radius: 6px;
            padding: 5px;
            position: absolute;
            z-index: 1;
            top: 125%;
            left: 50%;
            opacity: 0;
            transition: opacity 0.3s;
            font-weight: bold;
          }
          .tooltip .tooltiptext::after {
            content: "";
            position: absolute;
            bottom: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: transparent transparent white transparent;
          }
          .tooltip:hover .tooltiptext {
            visibility: visible;
            opacity: 1;
          }
        </style>
    `;
}  
function getRotatingIconHtml() {
    return `
        <style>
            @keyframes rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            #kick-icon {
                animation: rotate 2s linear infinite;
            }
        </style>
        <i><svg id="kick-icon" xmlns="http://www.w3.org/2000/svg" height="24" width="20.90625" viewBox="0 0 446 512"><path fill="#ffffff" d="M386.5 34h-327C26.8 34 0 60.8 0 93.5v327.1C0 453.2 26.8 480 59.5 480h327.1c33 0 59.5-26.8 59.5-59.5v-327C446 60.8 419.2 34 386.5 34zM87.1 120.8h96v116l61.8-116h110.9l-81.2 132H87.1v-132zm161.8 272.1l-65.7-113.6v113.6h-96V262.1h191.5l88.6 130.8H248.9z"/></svg></i>
    `;
}
function createBtn_toggle(state) {
    const iconSvg = state === 1 ? getRotatingIconHtml() : `<i><svg xmlns="http://www.w3.org/2000/svg" height="24" width="20.90625" viewBox="0 0 446 512"><path fill="#00ff1e" d="M386.5 34h-327C26.8 34 0 60.8 0 93.5v327.1C0 453.2 26.8 480 59.5 480h327.1c33 0 59.5-26.8 59.5-59.5v-327C446 60.8 419.2 34 386.5 34zM87.1 120.8h96v116l61.8-116h110.9l-81.2 132H87.1v-132zm161.8 272.1l-65.7-113.6v113.6h-96V262.1h191.5l88.6 130.8H248.9z"/></svg></i>`;
    const tooltipText = state === 1 ? getTranslation('btn_toggle_1') : getTranslation('btn_toggle_2');
    const tooltipWidth = state === 1 ? getTranslation('btn_toggle_1.width') : getTranslation('btn_toggle_2.width');
    const tooltipMarginLeft = state === 1 ? getTranslation('btn_toggle_1.margin-left') : getTranslation('btn_toggle_2.margin-left');
    return `
        ${getCommonButtonStyles()}
        <div class="tooltip">
          ${iconSvg}
          <span class="tooltiptext" style="width: ${tooltipWidth}; margin-left: ${tooltipMarginLeft};">${tooltipText}</span>
        </div>
    `;
}
function createBtn_toggle2() {
    return `
        ${getCommonButtonStyles()}
        <div class="tooltip">
          <i><svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="24" width="24""viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><style type="text/css">.st0{fill:#AB90FE;}.st1{fill:#FFFFFF;}</style><path class="st0" d="M5.7,0L1.1,4.3v15.4h5.4V24l4.5-4.3h3.6l8.1-7.7V0H5.7z"/><path class="st1" d="M21.1,11.1l-3.6,3.4h-3.6l-3.2,3v-3H6.6V1.7h14.5V11.1z"/><rect x="16.5" y="4.8" class="st0" width="1.8" height="5.1"/><rect x="11.5" y="4.8" class="st0" width="1.8" height="5.1"/></svg></i>
          <span class="tooltiptext" style="width: ${getTranslation('btn_toggle2.width')}; margin-left: ${getTranslation('btn_toggle2.margin-left')};">${getTranslation('btn_toggle2')}</span>
        </div>
    `;
}
function createBtn_toggle_main() {
    return `
        ${getCommonButtonStyles()}
        <div class="tooltip">
          ${getRotatingIconHtml()}
          <span class="tooltiptext" style="width: ${getTranslation('btn_toggle_main.width')}; margin-left: ${getTranslation('btn_toggle_main.margin-left')};">${getTranslation('btn_toggle_main')}</span>
        </div>
    `;
}
