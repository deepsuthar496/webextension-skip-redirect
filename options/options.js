const MODE_OPTIONS = {
  OFF: "off",
  NO_SKIP_URLS_LIST: "noSkipUrlsList",
  SKIP_URLS_LIST: "skipUrlsList",
};

const NO_SKIP_URLS_LIST = "noSkipUrlsList";
const NO_SKIP_PARAMETERS_LIST = "noSkipParametersList";
const SKIP_URLS_LIST = "skipUrlsList";
const SYNC_LISTS_ENABLED = "syncListsEnabled";

const NOTIFICATION_POPUP_ENABLED = "notificationPopupEnabled";
const NOTIFICATION_DURATION = "notificationDuration";

const SKIP_REDIRECTS_TO_SAME_DOMAIN = "skipRedirectsToSameDomain";

const MODE_ELEMENTS = {
  OFF: "mode-off",
  NO_SKIP_URLS_LIST: "mode-no-skip-urls-list",
  SKIP_URLS_LIST: "mode-skip-urls-list",
};

const NO_SKIP_URLS_LIST_ERROR = "no-skip-urls-list-error";
const NO_SKIP_PARAMETERS_LIST_ERROR = "no-skip-parameters-list-error";

const NOTIFICATION_DURATION_ELEMENT = "notification-duration";
const NOTIFICATION_POPUP_ENABLED_ELEMENT = "notification-popup-enabled";
const SKIP_REDIRECTS_TO_SAME_DOMAIN_ELEMENT = "skipRedirectsToSameDomain";

let timeout;

function restoreOptions() {
  const options = [
    MODE_OPTIONS.OFF,
    MODE_OPTIONS.NO_SKIP_URLS_LIST,
    MODE_OPTIONS.SKIP_URLS_LIST,
    NO_SKIP_URLS_LIST,
    NO_SKIP_PARAMETERS_LIST,
    SKIP_URLS_LIST,
    SYNC_LISTS_ENABLED,
    NOTIFICATION_POPUP_ENABLED,
    NOTIFICATION_DURATION,
    SKIP_REDIRECTS_TO_SAME_DOMAIN,
  ];

  browser.storage.local.get(options).then((result) => {
    setBooleanValue(ELEMENT_MODE_OFF, result[OPTION_MODE] === OPTION_MODE_OFF);
    setBooleanValue(ELEMENT_MODE_NO_SKIP_URLS_LIST, result[OPTION_MODE] === OPTION_MODE_NO_SKIP_URLS_LIST);
    setBooleanValue(ELEMENT_MODE_SKIP_URLS_LIST, result[OPTION_MODE] === OPTION_MODE_SKIP_URLS_LIST);

    setTextValue(ELEMENT_NO_SKIP_URLS_LIST, result[NO_SKIP_URLS_LIST].join("\n"));
    maybeHighlightError(result[NO_SKIP_URLS_LIST], ELEMENT_NO_SKIP_URLS_LIST, NO_SKIP_URLS_LIST_ERROR);

    setTextValue(ELEMENT_NO_SKIP_PARAMETERS_LIST, result[NO_SKIP_PARAMETERS_LIST].join("\n"));
    maybeHighlightError(result[NO_SKIP_PARAMETERS_LIST], ELEMENT_NO_SKIP_PARAMETERS_LIST, NO_SKIP_PARAMETERS_LIST_ERROR);

    setBooleanValue(ELEMENT_SYNC_LISTS_ENABLED, result[SYNC_LISTS_ENABLED]);
    setBooleanValue(ELEMENT_NOTIFICATION_POPUP_ENABLED, result[NOTIFICATION_POPUP_ENABLED]);
    setTextValue(ELEMENT_NOTIFICATION_DURATION, result[NOTIFICATION_DURATION]);
    setBooleanValue(ELEMENT_SKIP_REDIRECTS_TO_SAME_DOMAIN, result[SKIP_REDIRECTS_TO_SAME_DOMAIN]);
  });
}

function enableAutosave() {
  for (const input of document.querySelectorAll("input:not([type=radio]):not([type=checkbox]), textarea")) {
    input.addEventListener("input", delayedSaveOptions);
  }
  for (const input of document.querySelectorAll("input[type=radio], input[type=checkbox]")) {
    input.addEventListener("change", saveOptions);
  }
}

function loadTranslations() {
  for (const element of document.querySelectorAll("[data-i18n]")) {
    const translationKey = element.getAttribute("data-i18n");
    if (typeof browser === "undefined" || !browser.i18n.getMessage(translationKey)) {
      element.textContent = element.getAttribute("data-i18n");
    } else {
      element.innerHTML = browser.i18n.getMessage(translationKey);
    }
  }
}

function setTextValue(elementID, newValue) {
  const oldValue = document.getElementById(elementID).value;

  if (oldValue !== newValue) {
    document.getElementById(elementID).value = newValue;
  }
}

function setBooleanValue(elementID, newValue) {
  document.getElementById(elementID).checked = newValue;
}

function getRegExpError(noSkipUrlsList) {
  for (const line of noSkipUrlsList) {
    if (line.trim() === "") {
      return {
        line,
        message: "Empty line",
      };
    }
    try {
      new RegExp(line);
    } catch (exception) {
      return {
        line,
        message: exception.message,
      };
    }
  }
  return null;
}

function maybeHighlightError(list, listElementId, errorElementId) {
  const listElement = document.querySelector(`#${listElementId}`);
  const errorElement
