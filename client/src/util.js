const validateTags = (tags) => {
    if (tags[0] === '') {
        return true;
    } else {
        const re = /^[a-zA-Z0-9_]+$/;
        for (let i = 0; i < tags.length; i++) {
            if (!re.test(tags[i])) {
                return false;
            }
        }
        return true;
    }
}

export const shuffleArray = (sourceArray) => {
    // 配列は参照渡しなので array = sourceArray だと元の配列自体の順番も変わってしまう
    const array = [...sourceArray];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default validateTags;