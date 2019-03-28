// Original Implementation of the getNewRepeat plugin:
// https://marketing.adobe.com/resources/help/en_US/sc/implement/getNewRepeat.html
// This rewrite will allow you to store the new/repeat times in local storage. You
// can modify the getValue and setValue functions if you want use a different storage
// algorithm.
function getNewRepeat(daysTillExpiration, cookieName) {

    // StorageKeyValue -> Maybe String (returns null if no value is stored)
    var getValue = window.localStorage.getItem;

    // StorageKeyString -> StorageValue -> NumberOfDaysTillExpiration -> IO
    var setValue = window.localStorage.setItem;

    daysTillExpiration = daysTillExpiration || 30;
    cookieName = cookieName || 's_nr';
    var currentTime = (new Date()).getTime();
    var unitThirtyMinutes = 30*60*1000;
    var storedValue = getValue(cookieName);

    if(!storedValue) {
        // Store value as "unixTime-New", the time when the user
        // first arrived on the site.
        setValue(cookieName, currentTime + '-New', daysTillExpiration);
        return 'New';
    }

    var deserialized = storedValue.split('-');
    var arrivalDate = deserialized[0];
    var visitorStatus = deserialized[1];

    // A user will be considered new as long as they stay active
    // for 30 minutes. Otherwise, they become a repeat.
    if (currentTime - arrivalDate < unitThirtyMinutes && visitorStatus == 'New') {
        setValue(cookieName, currentTime + '-New', daysTillExpiration);
        return 'New';
    } else {
        setValue(cookieName, currentTime+'-Repeat', daysTillExpiration);
        return 'Repeat';
    }
}