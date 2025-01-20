import { atom, useAtom} from 'jotai';

const jwtAtom = atom(null); 

export function useJwt() {
    const [jwt, setJwtAtom] = useAtom(jwtAtom);

    const setJwt = (newJwt) => {
        // sync the storage the JWT in the store and in Jotai
        localStorage.setItem('jwt', newJwt);
        setJwtAtom(newJwt);
        // Q: If we can get the JWT from localstorage, why bother Jotai?
        // A: For isolation (so that we can switch from localstorage to
        // other storage technology without affecting the components)
    }

    const getJwt = () => {
        const storedJwt = localStorage.getItem('jwt');
        if (storedJwt && !jwt) {
            setJwtAtom(storedJwt);
        }
        return jwt || storedJwt;
    }

    const clearJwt = () => {
        localStorage.removeItem('jwt');
        setJwtAtom(null);
    }

    return {jwt, setJwt, getJwt, clearJwt}
}