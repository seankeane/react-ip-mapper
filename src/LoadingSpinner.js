import React from "react";

export default function LoadingSpinner({progress}) {
    return (
        <>
            <div className="spinner-container">
                <div className="loading-spinner"></div>
            </div>
            <div className="progress-percentage">Fetching Location Data... ({progress}%)</div>
        </>
    );
}