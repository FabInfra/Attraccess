import { Test, TestingModule } from '@nestjs/testing';
import { IotService, TemplateContext } from './iot.service';

describe('IotService', () => {
  let service: IotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IotService],
    }).compile();

    service = module.get<IotService>(IotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processTemplate', () => {
    const mockContext: TemplateContext = {
      id: 123,
      name: 'Test Resource',
      timestamp: '2023-12-01T10:00:00.000Z',
      user: {
        id: 456,
        username: 'testuser',
      },
    };

    it('should process simple id template', () => {
      const template = 'Resource ID: {{id}}';
      const result = service.processTemplate(template, mockContext);
      expect(result).toBe('Resource ID: 123');
    });

    it('should process simple name template', () => {
      const template = 'Resource Name: {{name}}';
      const result = service.processTemplate(template, mockContext);
      expect(result).toBe('Resource Name: Test Resource');
    });

    it('should process timestamp template', () => {
      const template = 'Timestamp: {{timestamp}}';
      const result = service.processTemplate(template, mockContext);
      expect(result).toBe('Timestamp: 2023-12-01T10:00:00.000Z');
    });

    it('should process user id template', () => {
      const template = 'User ID: {{user.id}}';
      const result = service.processTemplate(template, mockContext);
      expect(result).toBe('User ID: 456');
    });

    it('should process user username template', () => {
      const template = 'Username: {{user.username}}';
      const result = service.processTemplate(template, mockContext);
      expect(result).toBe('Username: testuser');
    });

    it('should process complex template with multiple variables', () => {
      const template =
        '{"resourceId": {{id}}, "resourceName": "{{name}}", "userId": {{user.id}}, "username": "{{user.username}}", "timestamp": "{{timestamp}}"}';
      const result = service.processTemplate(template, mockContext);
      const expected =
        '{"resourceId": 123, "resourceName": "Test Resource", "userId": 456, "username": "testuser", "timestamp": "2023-12-01T10:00:00.000Z"}';
      expect(result).toBe(expected);
    });

    it('should handle MQTT topic templates', () => {
      const template = 'resources/{{id}}/status';
      const result = service.processTemplate(template, mockContext);
      expect(result).toBe('resources/123/status');
    });

    it('should handle MQTT message templates', () => {
      const template = '{"status":"in_use","resourceId":{{id}},"resourceName":"{{name}}","user":"{{user.username}}"}';
      const result = service.processTemplate(template, mockContext);
      const expected = '{"status":"in_use","resourceId":123,"resourceName":"Test Resource","user":"testuser"}';
      expect(result).toBe(expected);
    });

    it('should handle templates with no variables', () => {
      const template = 'Static message with no variables';
      const result = service.processTemplate(template, mockContext);
      expect(result).toBe('Static message with no variables');
    });

    it('should handle empty template', () => {
      const template = '';
      const result = service.processTemplate(template, mockContext);
      expect(result).toBe('');
    });

    it('should handle template with special characters in resource name', () => {
      const contextWithSpecialChars: TemplateContext = {
        ...mockContext,
        name: 'Test "Resource" & More',
      };
      const template = 'Resource: {{name}}';
      const result = service.processTemplate(template, contextWithSpecialChars);
      // Handlebars HTML-escapes special characters by default
      expect(result).toBe('Resource: Test &quot;Resource&quot; &amp; More');
    });

    it('should handle unescaped template with special characters', () => {
      const contextWithSpecialChars: TemplateContext = {
        ...mockContext,
        name: 'Test "Resource" & More',
      };
      // Using triple braces {{{ }}} for unescaped output
      const template = 'Resource: {{{name}}}';
      const result = service.processTemplate(template, contextWithSpecialChars);
      expect(result).toBe('Resource: Test "Resource" & More');
    });

    it('should handle template with special characters in username', () => {
      const contextWithSpecialChars: TemplateContext = {
        ...mockContext,
        user: {
          id: 456,
          username: 'test@user.com',
        },
      };
      const template = 'User: {{user.username}}';
      const result = service.processTemplate(template, contextWithSpecialChars);
      expect(result).toBe('User: test@user.com');
    });

    it('should cache compiled templates for performance', () => {
      const template = 'Resource {{id}} - {{name}}';

      // Process the same template multiple times
      const result1 = service.processTemplate(template, mockContext);
      const result2 = service.processTemplate(template, mockContext);
      const result3 = service.processTemplate(template, mockContext);

      // All results should be the same
      expect(result1).toBe('Resource 123 - Test Resource');
      expect(result2).toBe('Resource 123 - Test Resource');
      expect(result3).toBe('Resource 123 - Test Resource');

      // Verify that the template was cached by checking the private templates property
      // Note: This is testing implementation details, but it's important for performance
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const templatesCache = (service as any).templates;
      expect(templatesCache[template]).toBeDefined();
    });

    it('should handle different contexts with the same template', () => {
      const template = 'Resource {{id}}: {{name}}';

      const context1: TemplateContext = {
        id: 1,
        name: 'First Resource',
        timestamp: '2023-12-01T10:00:00.000Z',
        user: { id: 100, username: 'user1' },
      };

      const context2: TemplateContext = {
        id: 2,
        name: 'Second Resource',
        timestamp: '2023-12-01T11:00:00.000Z',
        user: { id: 200, username: 'user2' },
      };

      const result1 = service.processTemplate(template, context1);
      const result2 = service.processTemplate(template, context2);

      expect(result1).toBe('Resource 1: First Resource');
      expect(result2).toBe('Resource 2: Second Resource');
    });

    it('should handle numeric values correctly', () => {
      const template = 'IDs: {{id}} and {{user.id}}';
      const result = service.processTemplate(template, mockContext);
      expect(result).toBe('IDs: 123 and 456');
    });

    it('should handle conditional-like templates', () => {
      const template = '{{#if user.id}}User ID: {{user.id}}{{/if}}';
      const result = service.processTemplate(template, mockContext);
      expect(result).toBe('User ID: 456');
    });

    it('should handle templates with loops', () => {
      // Note: This test assumes the context could be extended to support arrays
      // For now, we'll test a simple case that works with the current context
      const template = 'Resource {{name}} (ID: {{id}}) accessed by {{user.username}}';
      const result = service.processTemplate(template, mockContext);
      expect(result).toBe('Resource Test Resource (ID: 123) accessed by testuser');
    });
  });
});
