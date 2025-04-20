import React from 'react';
import { Button } from 'antd';
import { WrapperNotify } from './style';

const NotifyComponent = ({ status, title, subTitle = '', btnTitle,  onClose }) => {
    return (
      <WrapperNotify
        status={status}
        title={title}
        subTitle={subTitle}
        extra={
          <Button type="primary" onClick={onClose}>
            {btnTitle}
          </Button>
        }
      />
    );
  };

export default NotifyComponent;
