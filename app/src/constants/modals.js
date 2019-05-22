import { identifierToEnodeHighAndLow } from "../util/enodetools";

export const addAdminDisplay = {
    submitText: "Add Admin Account",
    errorMessage: "Account address is not correct",
    inputPlaceholder: "Ex: 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A",
    label: "Account Address",
    heading: "Add Admin Account",
    subHeading: "Admin accounts can..."
};

export const removeAdminDisplay = value => ({
    heading: "Are you sure?",
    subHeading: `Remove "${value}" as an admin account?`
});

export const addEnodeDisplay = {
    submitText: "Add Whitelisted Node",
    errorMessage: "Enode URL must include Address, IP address and Port.",
    inputPlaceholder: "Ex: 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A",
    label: "Enode URL",
    heading: "Add Whitelisted Node",
    subHeading:
        "Nodes can connect to each other if they are both whitelisted. See formatting details here."
};

export const removeEnodeDisplay = value => ({
    heading: "Are you sure?",
    subHeading: `Remove "${identifierToEnodeHighAndLow(
        value
    )}" as a whitelisted node?`
});
