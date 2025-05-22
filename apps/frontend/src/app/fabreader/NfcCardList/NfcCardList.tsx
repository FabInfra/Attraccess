import {
  TableHeader,
  Table,
  TableBody,
  TableColumn,
  TableCell,
  TableRow,
  CardBody,
  CardHeader,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Alert,
  Chip,
} from '@heroui/react';
import { Card } from '@heroui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AttraccessUser, useTranslations } from '@attraccess/plugins-frontend-ui';
import {
  NFCCard,
  useFabReaderNfcCardsServiceGetAllCards,
  useFabReaderReadersServiceResetNfcCard,
  useUsersServiceGetOneUserById,
  useFabReaderReadersServiceEnrollNfcCard,
  useFabReaderNfcCardsServiceToggleCardDisabled,
} from '@attraccess/react-query-client';
import de from './NfcCardList.de.json';
import en from './NfcCardList.en.json';
import { FabreaderSelect } from '../FabreaderSelect/FabreaderSelect';
import { useToastMessage } from '../../../components/toastProvider';
import { useAuth } from '../../../hooks/useAuth';

interface DeleteModalProps {
  show: boolean;
  close: () => void;
  cardId: number | null;
}

const NfcCardDeleteModal = (props: DeleteModalProps) => {
  const { t } = useTranslations('fabreader-delete-card-modal', {
    de,
    en,
  });

  const [readerId, setReaderId] = useState<number | null>(null);

  const { mutate: resetNfcCard } = useFabReaderReadersServiceResetNfcCard();

  const deleteCard = useCallback(() => {
    if (!props.cardId || !readerId) {
      return;
    }

    resetNfcCard({ requestBody: { readerId, cardId: props.cardId } });
  }, [props.cardId, resetNfcCard, readerId]);

  return (
    <Modal isOpen={props.show} onClose={() => props.close()} scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <h1>{t('nfcCardsTable.deleteModal.title')}</h1>
        </ModalHeader>
        <ModalBody>
          <p>{t('nfcCardsTable.deleteModal.description', { id: props.cardId })}</p>
          <FabreaderSelect
            label={t('nfcCardsTable.deleteModal.readerLabel')}
            placeholder={t('nfcCardsTable.deleteModal.readerPlaceholder')}
            selection={readerId}
            onSelectionChange={(readerId) => setReaderId(readerId ?? null)}
          />
        </ModalBody>
        <ModalFooter>
          <Button onPress={() => props.close()}>{t('nfcCardsTable.deleteModal.cancel')}</Button>
          <Button isDisabled={!readerId} onPress={deleteCard}>
            {t('nfcCardsTable.deleteModal.delete')} ID: {!readerId ? 'null' : readerId}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface NfcCardTableCellProps {
  header: string;
  card: NFCCard;
  onDeleteClick: () => void;
  onToggleDisabled: () => void;
}

const NfcCardTableCell = (props: NfcCardTableCellProps) => {
  const { t } = useTranslations('nfccard-list-table-cell', {
    de,
    en,
  });

  const { data: user } = useUsersServiceGetOneUserById({ id: props.card.userId }, undefined, {
    enabled: props.header === 'userId',
  });

  if (props.header === 'userId') {
    return <AttraccessUser user={user} />;
  }

  if (props.header === 'isDisabled') {
    return (
      <Chip color={props.card.isDisabled ? 'danger' : 'success'}>
        {props.card.isDisabled ? t('nfcCardsTable.status.disabled') : t('nfcCardsTable.status.enabled')}
      </Chip>
    );
  }

  if (props.header === 'actions') {
    return (
      <div className="flex gap-2">
        <Button 
          color={props.card.isDisabled ? 'success' : 'warning'} 
          onPress={() => props.onToggleDisabled()}
        >
          {props.card.isDisabled ? t('nfcCardsTable.actions.enable') : t('nfcCardsTable.actions.disable')}
        </Button>
        <Button color="danger" onPress={() => props.onDeleteClick()}>
          {t('nfcCardsTable.actions.delete')}
        </Button>
      </div>
    );
  }

  return props.card[props.header as keyof NFCCard];
};

const EnrollNfcCardButton = () => {
  const { t } = useTranslations('fabreader-enroll-nfc-card-button', {
    de,
    en,
  });

  const [show, setShow] = useState(false);
  const [readerId, setReaderId] = useState<number | null>(null);

  const { mutate: enrollNfcCardMutation } = useFabReaderReadersServiceEnrollNfcCard();

  const enrollNfcCard = useCallback(() => {
    if (!readerId) {
      return;
    }

    enrollNfcCardMutation({ requestBody: { readerId } });
  }, [readerId, enrollNfcCardMutation]);

  return (
    <>
      <Button color="primary" onPress={() => setShow(true)}>
        {t('enroll')}
      </Button>
      <Modal isOpen={show} onClose={() => setShow(false)} scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            <h1>{t('enrollModal.title')}</h1>
          </ModalHeader>
          <ModalBody>
            <p>{t('enrollModal.description')}</p>
            <FabreaderSelect
              label={t('enrollModal.readerLabel')}
              placeholder={t('enrollModal.readerPlaceholder')}
              selection={readerId}
              onSelectionChange={(readerId) => setReaderId(readerId ?? null)}
            />
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setShow(false)}>{t('enrollModal.cancel')}</Button>
            <Button isDisabled={!readerId} onPress={enrollNfcCard}>
              {t('enrollModal.enroll')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export function NfcCardList() {
  const { t } = useTranslations('nfccard-list', {
    de,
    en,
  });

  const { data: cards, error: cardsError, refetch: refetchCards } = useFabReaderNfcCardsServiceGetAllCards(undefined, {
    refetchInterval: 5000,
  });

  const toast = useToastMessage();

  const { user } = useAuth();

  const { mutate: toggleCardDisabled } = useFabReaderNfcCardsServiceToggleCardDisabled({
    onSuccess: (data) => {
      toast.success({
        title: t('cardStatusToggled'),
        description: data.isDisabled 
          ? t('cardDisabledSuccess', { id: data.id }) 
          : t('cardEnabledSuccess', { id: data.id }),
      });
      refetchCards();
    },
    onError: (error) => {
      toast.error({
        title: t('errorToggleCardStatus'),
        description: (error as Error).message,
      });
    },
  });

  useEffect(() => {
    if (cardsError) {
      toast.error({
        title: t('errorFetchCards'),
        description: (cardsError as Error).message,
      });
    }
  }, [cardsError, toast, t]);

  const userCanManage = useMemo(() => {
    return !!user?.systemPermissions.canManageSystemConfiguration;
  }, [user]);

  const headers = useMemo(() => {
    const headers: Array<keyof NFCCard | 'actions'> = ['id', 'uid', 'isDisabled'];
    if (userCanManage) {
      headers.push('userId');
    }

    headers.push('createdAt', 'actions');

    return headers;
  }, [userCanManage]);

  const [cardToDeleteId, setCardToDeleteId] = useState<number | null>(null);

  const handleToggleDisabled = useCallback((cardId: number) => {
    toggleCardDisabled({ requestBody: { cardId } });
  }, [toggleCardDisabled]);

  return (
    <>
      <Alert color="danger">{t('workInProgress')}</Alert>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h1>{t('nfcCards')}</h1>
          <EnrollNfcCardButton />
        </CardHeader>
        <CardBody>
          <NfcCardDeleteModal
            show={cardToDeleteId !== null}
            close={() => setCardToDeleteId(null)}
            cardId={cardToDeleteId}
          />

          <Table aria-label={t('nfcCards')} removeWrapper>
            <TableHeader>
              {headers.map((header) => (
                <TableColumn key={header}>{t('nfcCardsTable.headers.' + header)}</TableColumn>
              ))}
            </TableHeader>
            <TableBody emptyContent={t('noNfcCardsFound')}>
              {(cards ?? []).map((card) => (
                <TableRow key={card.id}>
                  {headers.map((header) => (
                    <TableCell key={header}>
                      <NfcCardTableCell 
                        header={header} 
                        card={card} 
                        onDeleteClick={() => setCardToDeleteId(card.id)}
                        onToggleDisabled={() => handleToggleDisabled(card.id)}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}
