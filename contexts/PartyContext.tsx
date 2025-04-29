'use client';

import React, { createContext, useContext, useState } from 'react';

interface PartyContextType {
    partyMode: boolean;
    togglePartyMode: () => void;
}

const PartyContext = createContext<PartyContextType | undefined>(undefined);

export const PartyProvider = ({ children }: { children: React.ReactNode }) => {
    const [partyMode, setPartyMode] = useState(false);

    const togglePartyMode = () => setPartyMode(prev => !prev);

    return (
        <PartyContext.Provider value={{ partyMode, togglePartyMode }}>
            {children}
        </PartyContext.Provider>
    );
};

export const useParty = (): PartyContextType => {
    const context = useContext(PartyContext);
    if (!context) {
        throw new Error('useParty must be used within a PartyProvider');
    }
    return context;
};
