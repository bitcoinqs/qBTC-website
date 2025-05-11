// lib/ga.ts
import ReactGA from 'react-ga4';

export const GA_MEASUREMENT_ID = 'G-2XRV451QTW';

export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const logPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};
