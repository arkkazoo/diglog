const validateTags = (tags) => {
    if (tags[0] === '') {
        return true;
    }  else {
        const re = /^[a-zA-Z0-9_]+$/;
        for (let i = 0; i < tags.length; i++) {
            if (!re.test(tags[i])) {
                return false;
            }
        }
        return true;
    }
}

export default validateTags;