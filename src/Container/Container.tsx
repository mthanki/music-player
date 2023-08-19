import React, { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}
const Container: React.FC<Props> = ({ children }) => {
    return <div className='main'>{children}</div>
}

export default Container;