import { Button, ButtonProps } from '@heroui/react';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import 'esp-web-tools';
import de from './FabreaderFlashButton.de.json';
import en from './FabreaderFlashButton.en.json';
import React from 'react';

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

// Local manifest URL that points to the server-provided manifest
const MANIFEST_URL = '/_fabreader_assets/manifest.json';

export function FabreaderFlashButton(props: Omit<ButtonProps, 'slot' | 'onPress'>) {
  const { t } = useTranslations('fabreader-flash-button', {
    de,
    en,
  });

  return (
    <esp-web-install-button manifest={MANIFEST_URL}>
      <Button {...props} slot="activate" />
      <Button {...props} isDisabled color="danger" slot="unsupported">
        {t('errors.unsupported')}
      </Button>
      <Button {...props} isDisabled color="danger" slot="not-allowed">
        {t('errors.notAllowed')}
      </Button>
    </esp-web-install-button>
  );
}
