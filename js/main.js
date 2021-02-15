window.i18n = [];
window.errorCodes = [];

async function i18nLoader(url, langs) {
    if (Array.isArray(langs)) {
        for (const lang of langs) {
            const i18nUrl = `${url}/${lang}.json`
            if (!window.i18n || !window.i18n[lang]) {
                await fetch(i18nUrl, {
                    cache: 'no-cache'
                })
                    .then(response => response.json())
                    .then(response => {
                        window.i18n[lang] = response;
                    })
                    .catch(error => console.log("", error));
            }
        }
    } else {
        const lang = langs;
        const i18nUrl = `${url}/${lang}.json`
        if (!window.i18n || !window.i18n[lang]) {
            await fetch(i18nUrl, {
                cache: 'no-cache'
            })
                .then(response => response.json())
                .then(response => {
                    window.i18n[lang] = response;
                })
                .catch(error => console.log("", error));
        }
    }
}

function bindI18n(lang) {
    ({labels, placeholders, kendoGridHeaders} = window.i18n[lang]);
    if (labels) {
        const elementIds = Object.keys(labels)
        for (const elementId of elementIds) {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerText = labels[elementId]
            }
        }
    }
    if (placeholders) {
        const elementIds = Object.keys(placeholders);
        for (const elementId of elementIds) {
            const element = document.getElementById(elementId);
            if (element) {
                element.placeholder = placeholders[elementId]
            }
        }
    }
    if (kendoGridHeaders) {
        const gridIds = Object.keys(kendoGridHeaders);
        for (const gridId of gridIds) {
            const fieldNames = Object.keys(kendoGridHeaders[gridId]);
            for (const fieldName of fieldNames) {
                const position = `#${gridId} thead [data-field=${fieldName}] .k-link`
                const value = kendoGridHeaders[gridId][fieldName];
                $(position).html(value);
            }
        }
    }
    showCurrentErrors(lang);
}

function bindDropdownLanguage(lang) {
    const languageSettingUrl = '../settings/language_selection.json';
    if (!window.languageSelectionSetting) {
        fetch(languageSettingUrl, {
            cache: 'no-cache'
        })
            .then(response => response.json())
            .then(setting => {
                window.languageSelectionSetting = setting
                dropdownLangSelect(lang);
            })
            .then(() => {
                bindDropdownLanguageEvent();
            })
            .catch(error => console.log("found error", error));
    } else {
        dropdownLangSelect(lang);
        bindDropdownLanguageEvent();
    }
}

function dropdownLangSelect(lang) {
    if (window.languageSelectionSetting && window.languageSelectionSetting.languages) {
        const flagImageUrl = window.languageSelectionSetting["flag_img_url"];
        const imageAttribute = window.languageSelectionSetting["img_attribute"];
        const dpElementId = window.languageSelectionSetting["element_id"];
        const dpImageElementId = window.languageSelectionSetting["element_img_id"];
        if (!flagImageUrl || !imageAttribute || !dpElementId || !dpImageElementId) {
            console.log("not found require data for language selection setting");
            return;
        }

        for (const key in window.languageSelectionSetting.languages) {
            const choiceElementId = window.languageSelectionSetting.languages[key]["element_id"];
            const imageSpritesCode = window.languageSelectionSetting.languages[key]["img_sprites_code"];
            const choiceImageElementId = window.languageSelectionSetting.languages[key]["element_img_id"];
            const dpImageElement = document.getElementById(dpImageElementId);
            const choiceElement = document.getElementById(choiceElementId);
            if (!choiceElementId || !imageSpritesCode || !choiceImageElementId || !dpImageElement || !choiceElement) {
                console.log("not found require data for language selection choice setting");
                return;
            }
            if (lang === key) {
                dpImageElement.setAttribute(imageAttribute, `${flagImageUrl}#${imageSpritesCode}`)
                choiceElement.classList.add("active");
                createCookie("current_language", key, 30);
            } else {
                choiceElement.classList.remove("active")
            }
        }
    }
}

function bindDropdownLanguageEvent() {
    if (window.languageSelectionSetting && window.languageSelectionSetting.languages) {
        for (const key in window.languageSelectionSetting.languages) {
            const choiceElementId = window.languageSelectionSetting.languages[key]["element_id"];
            const choiceElement = document.getElementById(choiceElementId);
            if (!choiceElementId || !choiceElementId || !choiceElement) {
                console.log("not found require data for event binding");
                return;
            }
            choiceElement.addEventListener("click", event => {
                event.preventDefault();
                dropdownLangSelect(key)
                bindI18n(key);
            });
        }
    }
}

function createCookie(name, value, days) {
    let expires;
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    } else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            let c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function bindErrors(errors) {
    if (errors) {
        const langs = Object.keys(window.i18n)
        for (const lang of langs) {
            for (const errmsg of errors) {
                if (window.i18n.hasOwnProperty(lang)
                    && window.i18n[lang]['messages']
                    && window.i18n[lang]['messages']['errors']
                    && window.i18n[lang]['messages']['errors'][errmsg['message_code']]) {
                    const mappingErrors = window.i18n[lang]['messages']['errors'][errmsg['message_code']];
                    const elementID = mappingErrors['elementId'];
                    const feedbackId = mappingErrors['feedbackId'];
                    const errorMessage = mappingErrors['message'];
                    const sources = errmsg['sources'];
                    let feedbackMessage;
                    if (elementID && feedbackId) {
                        if (window.errorCodes.includes(errmsg['message_code']) === false) {
                            window.errorCodes.push(errmsg['message_code'])
                        }
                        const feedback = document.getElementById(feedbackId);
                        if (feedback) {
                            if (mappingErrors['template'] && sources) {
                                feedbackMessage = eval("`" + errorMessage + "`");
                            } else {
                                feedbackMessage = errorMessage;
                            }
                            window.i18n[lang]['messages']['errors'][errmsg['message_code']]['last_feedback_message'] = feedbackMessage;
                        }
                    }

                }
            }
        }
    }
}

function showError(messageCode, lang) {
    if (window.i18n.hasOwnProperty(lang)
        && window.i18n[lang]['messages']
        && window.i18n[lang]['messages']['errors']
        && window.i18n[lang]['messages']['errors'][messageCode]
    ) {
        const mappingErrors = window.i18n[lang]['messages']['errors'][messageCode];
        const elementID = mappingErrors['elementId'];
        const feedbackId = mappingErrors['feedbackId'];
        const lastFeedbackMessage = mappingErrors['last_feedback_message'];
        if (elementID && feedbackId && lastFeedbackMessage) {
            $(`#${elementID}`).parents('.k-widget').addClass('k-invalid');
            const feedback = document.getElementById(feedbackId);
            feedback.innerText = lastFeedbackMessage;
        }
    }
}

function hideError(messageCode) {
    const langs = Object.keys(window.i18n)
    for (const lang of langs) {
        if (window.i18n.hasOwnProperty(lang)
            && window.i18n[lang]['messages']
            && window.i18n[lang]['messages']['errors']
            && window.i18n[lang]['messages']['errors'][messageCode]
        ) {
            const mappingErrors = window.i18n[lang]['messages']['errors'][messageCode];
            const elementID = mappingErrors['elementId'];
            const feedbackId = mappingErrors['feedbackId'];
            const lastFeedbackMessage = mappingErrors['last_feedback_message'];
            if (elementID && feedbackId && lastFeedbackMessage) {
                $(`#${elementID}`).parents('.k-widget').removeClass('k-invalid');
                const feedback = document.getElementById(feedbackId);
                feedback.innerText = "";
            }
        }
    }
}

function removeError(messageCode) {
    const index = window.errorCodes.indexOf(messageCode);
    if (index > -1) {
        window.errorCodes.splice(index, 1);
    }
    const langs = Object.keys(window.i18n)
    for (const lang of langs) {
        if (window.i18n.hasOwnProperty(lang)
            && window.i18n[lang]['messages']
            && window.i18n[lang]['messages']['errors']
            && window.i18n[lang]['messages']['errors'][messageCode]
        ) {
            const mappingErrors = window.i18n[lang]['messages']['errors'][messageCode];
            const elementID = mappingErrors['elementId'];
            const feedbackId = mappingErrors['feedbackId'];
            const lastFeedbackMessage = mappingErrors['last_feedback_message'];
            if (elementID && feedbackId && lastFeedbackMessage) {
                $(`#${elementID}`).parents('.k-widget').removeClass('k-invalid');
                const feedback = document.getElementById(feedbackId);
                window.i18n[lang]['messages']['errors'][messageCode]['last_feedback_message'] = "";
                feedback.innerText = "";
            }
        }
    }

}

function showCurrentErrors(lang){
    for(const errorCode of window.errorCodes){
        showError(errorCode, lang);
    }
}

function clearAllErrors(){
    const errorCodes = [...window.errorCodes];
    for(const errorCode of errorCodes){
        console.log(errorCode);
        removeError(errorCode);
    }
}