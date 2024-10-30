
export interface CreateBook {
    name: string;
    word: string;
    description: string;
    avatar: string;
}

export interface UpdateBook extends CreateBook {
    id: number;
}
export interface ModalProps {
    isOpen: boolean;
    modalType: string;
    record: UpdateBook,
    handleClose: Function;
}


export interface ListParams {
    name?: string;
    word?: string
}