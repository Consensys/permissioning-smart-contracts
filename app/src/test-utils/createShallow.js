import { shallow as _shallow } from "enzyme";

const createShallow = ({ dive }) => {
    const shallow = (node, options) => {
        let wrapper = _shallow(node, options);

        for (let i = 0; i < dive; i++) {
            if (wrapper.name().match(/^WithWidth(.+)$/)) {
                // Diving through a Meterial-UI WidthWith component can not be performed
                // by default because of React.Fragment used in withWidth
                // It is a known issue: https://github.com/airbnb/enzyme/issues/1213
                wrapper = wrapper
                    .dive()
                    .children()
                    .at(0);
            } else {
                wrapper = wrapper.dive();
            }
        }
        return wrapper;
    };

    return shallow;
};

export default createShallow;
