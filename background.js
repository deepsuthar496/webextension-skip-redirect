const OPTION_MODE = "mode";
const OPTION_MODE_OFF = "off";
const OPTION_MODE_NO_SKIP_URLS_LIST = "blacklist";
const OPTION_MODE_SKIP_URLS_LIST = "whitelist";
const OPTION_NO_SKIP_PARAMETERS_LIST = "no-skip-parameters-list";
const OPTION_NO_SKIP_URLS_LIST = "blacklist";
const OPTION_SKIP_URLS_LIST = "whitelist";
const OPTION_SYNC_LISTS_ENABLED = "syncListsEnabled";
const OPTION_NOTIFICATION_POPUP_ENABLED = "notificationPopupEnabled";
const OPTION_NOTIFICATION_DURATION = "notificationDuration";
const OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN = "skipRedirectsToSameDomain";
const LIST_OPTIONS = [OPTION_NO_SKIP_PARAMETERS_LIST, OPTION_NO_SKIP_URLS_LIST, OPTION_SKIP_URLS_LIST];
const TOOLBAR_CONTEXT_MENU_ID = "copy-last-source-url";
const LINK_CONTEXT_MENU_ID = "copy-target-url";
const NOTIFICATION_ID = "notify-skip";
const ICON = "icon.svg";
const ICON_OFF = "icon-off.svg";
const ICON_NO_SKIP_URLS_LIST = "icon-no-skip-urls-list.svg";
const ICON_SKIP_URLS_LIST = "icon-skip-urls-list.svg";
const MAX_NOTIFICATION_URL_LENGTH = 100;
const DEFAULT_NO_SKIP_PARAMETERS_LIST = [
  "from",
  "ref",
  "ref_url",
  "referer",
  "referrer",
  "source",
];
const DEFAULT_NO_SKIP_URLS_LIST = [
  "/abp",
  "/account",
  "/adfs",
  "/auth",
  "/cookie",
  "/download",
  "/eid-client",
  "/login",
  "/logoff",
  "/logon",
  "/logout",
  "/oauth",
  "/openid",
  "/pay",
  "/preference",
  "/profile",
  "/register",
  "/saml",
  "/signin",
  "/signoff",
  "/signon",
  "/signout",
  "/signup",
  "/sso",
  "/subscribe",
  "/unauthenticated",
  "/verification",
];

let currentMode;
let noSkipParametersList = [];
let noSkipUrlsList = [];
let skipUrlsList = [];
let lastSourceURL;
let notificationPopupEnabled;
let notificationDuration;
let skipRedirectsToSameDomain;
let syncLists;

async function initialize() {
  try {
    const result = await browser.storage.local.get({
      [OPTION_MODE]: OPTION_MODE_NO_SKIP_URLS_LIST,
      [OPTION_NOTIFICATION_DURATION]: 3,
      [OPTION_NOTIFICATION_POPUP_ENABLED]: true,
      [OPTION_NO_SKIP_PARAMETERS_LIST]: DEFAULT_NO_SKIP_PARAMETERS_LIST,
      [OPTION_NO_SKIP_URLS_LIST]: DEFAULT_NO_SKIP_URLS_LIST,
      [OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN]: false,
      [OPTION_SYNC_LISTS_ENABLED]: false,
    });

    currentMode = result[OPTION_MODE];
    noSkipParametersList = result[OPTION_NO_SKIP_PARAMETERS_LIST];
    noSkipUrlsList = result[OPTION_NO_SKIP_URLS_LIST];
    skipUrlsList = result[OPTION_SKIP_URLS_LIST] || [];
    notificationPopupEnabled = result[OPTION_NOTIFICATION_POPUP_ENABLED];
    notificationDuration = result[OPTION_NOTIFICATION_DURATION];
    skipRedirectsToSameDomain = result[OPTION_SKIP_REDIRECTS_TO_SAME_DOMAIN];
    syncLists = result[OPTION_SYNC_LISTS_ENABLED];

    if (currentMode === OPTION_MODE_OFF) {
      disableSkipping();
    } else {
      enableSkipping();
    }

    browser.contextMenus.create({
      id: TOOLBAR_CONTEXT_MENU_ID,
      title: browser.i18n.getMessage("contextMenuToolbarLabel"),
      contexts: ["browser_action"],
      enabled: false,
    });

    browser.contextMenus.onClicked.addListener(
      (info, _tab) => {
        if (info.menuItemId === TOOLBAR_CONTEXT_MENU_ID) {
          copyToClipboard(lastSourceURL);
        }
      }
    );

    browser.contextMenus.create({
      id: LINK_CONTEXT_MENU_ID,
      title: browser.i18n.getMessage("contextMenuLinkLabel"),
      contexts: ["link"],
      enabled: true,
    });

    browser.contextMenus.onClicked.addListener(
      (info, _tab) => {
        if (info.menuItemId === LINK_CONTEXT_MENU_ID) {
