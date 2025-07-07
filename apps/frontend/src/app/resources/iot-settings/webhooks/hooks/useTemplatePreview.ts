import { useResourcesServiceGetOneResourceById } from '@fabaccess/react-query-client';
import { useAuth } from '../../../../../hooks/useAuth';

export const useTemplatePreview = (resourceId: number) => {
  // Fetch the resource data
  const { data: resource } = useResourcesServiceGetOneResourceById({ id: resourceId });
  const { user } = useAuth();

  // Create a preview context for rendering templates
  const previewContext = resource
    ? {
        id: resource.id,
        name: resource.name,
        timestamp: new Date().toISOString(),
        user: { id: user?.id as number, username: user?.username as string },
      }
    : null;

  /**
   * Generate a preview of a template by replacing variables
   */
  const previewTemplate = (template: string) => {
    if (!previewContext) return '';

    try {
      const result = template
        .replace(/\{\{id\}\}/g, String(previewContext.id))
        .replace(/\{\{name\}\}/g, previewContext.name)
        .replace(/\{\{timestamp\}\}/g, previewContext.timestamp)
        .replace(/\{\{user\.id\}\}/g, String(previewContext.user.id))
        .replace(/\{\{user\.username\}\}/g, previewContext.user.username);
      return result;
    } catch {
      return 'Error previewing template';
    }
  };

  return {
    previewTemplate,
    previewContext,
  };
};

export default useTemplatePreview;
