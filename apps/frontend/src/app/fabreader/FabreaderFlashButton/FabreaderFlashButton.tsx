import { Button, ButtonProps } from '@heroui/react';
import { useTranslations } from '@fabaccess/plugins-frontend-ui';
import 'esp-web-tools';
import de from './FabreaderFlashButton.de.json';
import en from './FabreaderFlashButton.en.json';
import React from 'react';
import { Firmware } from '../types';

// Add declaration for the custom element
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'esp-web-install-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          manifest: string;
        },
        HTMLElement
      >;
    }
  }
}

interface Props extends Omit<ButtonProps, 'slot' | 'onPress' | 'children'> {
  firmware: Firmware;
}

export function FabreaderFlashButton(props: Readonly<Props>) {
  const { t } = useTranslations('fabreader-flash-button', {
    de,
    en,
  });

  return (
    <esp-web-install-button manifest={props.firmware.manifest_path} data-cy="fabreader-flash-esp-web-install-button">
      <Button {...props} slot="activate" data-cy="fabreader-flash-activate-button">
        {t('button.flash')}
      </Button>
      <Button {...props} isDisabled color="danger" slot="unsupported" data-cy="fabreader-flash-unsupported-button">
        {t('errors.unsupported')}
      </Button>
      <Button {...props} isDisabled color="danger" slot="not-allowed" data-cy="fabreader-flash-not-allowed-button">
        {t('errors.notAllowed')}
      </Button>
    </esp-web-install-button>
  );
}
