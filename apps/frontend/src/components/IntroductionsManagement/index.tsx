import { useMemo } from 'react';
import { Card, CardHeader, CardBody, CardProps } from '@heroui/react';
import { HistoryIcon, ShieldCheckIcon } from 'lucide-react';
import { ResourceIntroduction, User } from '@attraccess/react-query-client';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import * as en from './en.json';
import * as de from './de.json';
import { PageHeader } from '../pageHeader';
import { Action, UserSelectionList } from '../userSelectionList';
import { useHasValidIntroduction } from '../../hooks/useHasValidIntroduction';

interface UserWithIntroductionStatus extends User {
  hasValidIntroduction: boolean;
}

interface IntroductionsManagementProps {
  introductions: ResourceIntroduction[];
  onGrantIntroduction: (user: User) => void;
  onRevokeIntroduction: (user: User) => void;
  isGranting: boolean;
  isRevoking: boolean;
  isLoadingIntroductions: boolean;
  onHistoryModalOpen: (props: { user: User; introduction: ResourceIntroduction }) => void;
}

export function IntroductionsManagement(props: Readonly<IntroductionsManagementProps & Omit<CardProps, 'children'>>) {
  const {
    introductions,
    onGrantIntroduction,
    onRevokeIntroduction,
    isGranting,
    isRevoking,
    isLoadingIntroductions,
    onHistoryModalOpen,
    ...rest
  } = props;

  const { t } = useTranslations('introductionsManagement', { en, de });

  const usersWithIntroductions = useMemo(() => {
    return (introductions ?? []).map((introduction) => introduction.receiverUser);
  }, [introductions]);

  const userHasValidIntroduction = useHasValidIntroduction({ introductions });

  const Actions = useMemo(
    () =>
      (user: UserWithIntroductionStatus): Action<UserWithIntroductionStatus>[] =>
        [
          {
            key: 'history',
            onClick: (clickedUser) => {
              const introductionOfUser = (introductions ?? []).find((intro) => intro.receiverUserId === clickedUser.id);

              if (!introductionOfUser) {
                return;
              }

              onHistoryModalOpen({ user: clickedUser, introduction: introductionOfUser });
            },
            isIconOnly: true,
            startContent: <HistoryIcon className="w-4 h-4" />,
          },
          {
            key: 'grant-revoke',
            label: user.hasValidIntroduction ? t('actions.revoke') : t('actions.grant'),
            isLoading: isRevoking ?? isGranting,
            onClick: (user) => {
              if (user.hasValidIntroduction) {
                onRevokeIntroduction(user);
                return;
              }

              onGrantIntroduction(user);
            },
          },
        ],
    [onHistoryModalOpen, onRevokeIntroduction, isRevoking, isGranting, t, onGrantIntroduction, introductions]
  );

  const userWithIntroductionStatus = useMemo((): UserWithIntroductionStatus[] => {
    return usersWithIntroductions.map((user) => {
      const hasValidIntroduction = userHasValidIntroduction(user);
      return {
        ...user,
        hasValidIntroduction,
      };
    });
  }, [usersWithIntroductions, userHasValidIntroduction]);

  return (
    <Card {...rest}>
      <CardHeader>
        <PageHeader title={t('title')} subtitle={t('subtitle')} icon={<ShieldCheckIcon />} noMargin={true} />
      </CardHeader>
      <CardBody>
        <UserSelectionList
          selectedUsers={userWithIntroductionStatus}
          onAddToSelection={onGrantIntroduction}
          addToSelectionIsLoading={isGranting}
          selectedUserIsLoading={isLoadingIntroductions}
          rowClassName={(user) =>
            user.hasValidIntroduction ? 'border-l-8 border-l-success' : 'border-l-8 border-l-danger'
          }
          tableProps={{
            removeWrapper: true,
            shadow: 'none',
          }}
          actions={Actions}
        />
      </CardBody>
    </Card>
  );
}
