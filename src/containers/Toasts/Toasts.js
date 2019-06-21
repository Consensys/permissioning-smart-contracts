// Libs
import React from "react";
// Context
import { useToast } from "../../context/toasts";
// Component
import Toasts from "../../components/Toasts/Toasts";

const ToastsContainer = () => {
    const { toasts, closeToast } = useToast();
    return <Toasts toasts={toasts} closeToast={closeToast} />;
};

export default ToastsContainer;
