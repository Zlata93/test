import '../styles/index.scss';

const body = document.querySelector('body');

body && body.addEventListener('click', (e) => {
    const clickedEl = e.target;

    if (clickedEl.classList.contains('e-accordion__short')) {
        toggleAccordion(clickedEl);
    } else if (clickedEl.classList.contains('history__transaction')) {
        const children = clickedEl.children;

        // assuming e-accordion__short is always the first child in children
        children.length && toggleAccordion(children[0]);

        // or we could loop through all children to make sure there's the one we need
        // for (let i = 0; i < children.length; i++) {
        //     if (children[i].classList.contains('e-accordion__short')) {
        //         toggleAccordion(children[i]);
        //         break;
        //     }
        // }

    } else if (clickedEl.classList.contains('onoffswitch')) {
        clickedEl.classList.toggle('onoffswitch_mode_switched');

        const re = /theme_color_\S+\b/g;

        const layout = document.querySelector('.layout');
        let elClassList = layout.classList.value;

        // assuming there's only one color class
        const oldTheme = layout.classList.value.match(re) && layout.classList.value.match(re)[0];

        const newTheme = oldTheme === 'theme_color_project-default' ? 'theme_color_project-inverse' : 'theme_color_project-default';

        elClassList = elClassList.replace(oldTheme, newTheme);
        layout.className = elClassList;
    } else {
        // if we clicked on the element inside e-accordion__short
        const elem = getParent(clickedEl);
        elem && toggleAccordion(elem);
    }
});

const toggleAccordion = (elem)=> {
    if (elem.classList.contains('e-accordion__short_state_opened')) {
        elem.classList.remove('e-accordion__short_state_opened');
    } else {
        elem.classList.add('e-accordion__short_state_opened');
    }
};

const getParent = (elem) => {
    const parent = elem.parentElement;
    if (!parent || parent.classList.contains('layout__container')) {
        return null;
    } else if (parent.classList.contains('e-accordion__short')) {
        return parent;
    } else {
        return getParent(parent);
    }
};
