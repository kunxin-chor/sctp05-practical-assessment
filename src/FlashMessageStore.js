// In most state management libraries, a 'data store'
// is the centralized storage for shared data
// In Jotai, a shared data is known as an 'Atom'

// Very similiar to a STATE
import { atom, useAtom} from 'jotai';

// Create a shared data using the atom function
// The parameter is the data that we want to share
export const flashMessageAtom = atom({
    message: '',
    type: 'info' // eg. success, error
})

// Custom Hook
// A hook is functionality that can be reused across components
export const useFlashMessage = () => {

    const [flashMessage, setFlashMessage] = useAtom(flashMessageAtom);

    const showMessage = (message, type) => {
        setFlashMessage({
            message, type
        })
    }

    const clearMessage = () => {
        setFlashMessage({
            message: '',
            type:'info'
        })
    }

    const getMessage = () => {
        return flashMessage
    }

    return {
        getMessage,
        showMessage,
        clearMessage
    }

}
