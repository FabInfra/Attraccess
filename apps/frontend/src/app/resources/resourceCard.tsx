import { ReactNode } from 'react';
import { filenameToUrl } from '../../api';
import { Card, CardBody, Image, CardHeader, CardFooter, CardProps, Skeleton, Link } from '@heroui/react';
import { Resource } from '@attraccess/react-query-client';

interface ResourceCardSkeletonProps extends CardProps {
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
}

function ResourceCardSkeleton(props: ResourceCardSkeletonProps) {
  return (
    <Card {...props}>
      <CardHeader className="pb-0 pt-2 px-4 flex-row justify-between items-center">{props.header}</CardHeader>
      <CardBody className="overflow-visible py-2">{props.body}</CardBody>
      <CardFooter>{props.footer}</CardFooter>
    </Card>
  );
}

export function ResourceCardSkeletonLoader() {
  return (
    <ResourceCardSkeleton
      isPressable={false}
      header={<Skeleton className="h-10 w-24" />}
      body={<Skeleton className="h-40 w-full" />}
      footer={<Skeleton className="h-10 w-24" />}
    />
  );
}

function ActualResourceCard(props: ResourceCardProps & { isPressable?: boolean }) {
  const { resource, badges, isPressable = false, ...rest } = props;

  return (
    <ResourceCardSkeleton
      isPressable={isPressable}
      header={
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col">
            <h4 className="font-bold text-large">{resource.name}</h4>
            {badges}
          </div>
        </div>
      }
      body={
        resource.imageFilename && (
          <div className="flex justify-center w-full">
            <Image
              alt={resource.name}
              className="object-cover rounded-xl"
              src={filenameToUrl(resource.imageFilename)}
              style={{ maxHeight: '200px' }}
            />
          </div>
        )
      }
      {...rest}
    />
  );
}

interface ResourceCardProps extends Omit<CardProps, 'resource'> {
  resource: Resource;
  badges?: ReactNode;
}

export function ResourceCard(props: ResourceCardProps & { href?: string }) {
  return (
    <ActualResourceCard {...props} isPressable={!!props.href || props.isPressable} as={props.href ? Link : undefined} />
  );
}
