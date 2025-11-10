// Import the necessary components from monaco-ext
import { ExtendableCodeEditor } from '../src/index.js';
import { ReadOnlyLines, LineSelection, HighLight, AutoResizeHeight } from '../src/features/index.js';
import themes from '../src/themes/index.js';
import * as monaco from 'monaco-editor';

// Sample code for the editor
const sampleCode = {
  javascript: `// Monaco-Ext Demo with TextMate Syntax Highlighting
// This is a demo of the Monaco-Ext editor
// Try selecting lines, highlighting, and other features

function factorial(n) {
  // Base case
  if (n <= 1) {
    return 1;
  }

  // Recursive case
  return n * factorial(n - 1);
}

// Regular expressions examples
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Test regex patterns
const testEmail = "user@example.com";
const isValidEmail = emailRegex.test(testEmail);
console.log(\`Email \${testEmail} is \${isValidEmail ? 'valid' : 'invalid'}\`);

// String replace with regex
const text = "The quick brown fox jumps over the lazy dog";
const replacedText = text.replace(/\\b\w{4}\\b/g, '****'); // Replace 4-letter words
console.log("Original:", text);
console.log("Replaced:", replacedText);

// Calculate some factorials
console.log("Factorial of 5:", factorial(5));
console.log("Factorial of 10:", factorial(10));

// Example of a class with template literals
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return \`Hello, my name is \${this.name} and I am \${this.age} years old.\`;
  }
}

const alice = new Person("Alice", 28);
console.log(alice.greet());

// Arrow functions and destructuring
const users = [
  { name: "John", age: 25, city: "New York" },
  { name: "Jane", age: 30, city: "San Francisco" }
];

const adultUsers = users
  .filter(({ age }) => age >= 18)
  .map(({ name, city }) => ({ name, city }));

console.log("Adult users:", adultUsers);
`,

  javascriptreact: `// Monaco-Ext JSX/React Demo with TextMate Syntax Highlighting
import React, { useState, useEffect } from 'react';

// Component with hooks and JSX
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Async data fetching with regex validation
    const fetchUser = async () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;

      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();

        // Validate email format
        if (userData.email && !emailRegex.test(userData.email)) {
          console.warn('Invalid email format:', userData.email);
        }

        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  // Event handlers
  const handleEdit = () => {
    console.log('Edit user:', user?.name);
  };

  const handleDelete = () => {
    const confirmRegex = /^(yes|y)$/i;
    const confirmation = prompt('Type "yes" to confirm deletion:');

    if (confirmation && confirmRegex.test(confirmation)) {
      console.log('User deleted');
    }
  };

  // Conditional rendering with JSX
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading user profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <h2>User not found</h2>
        <p>The requested user could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <header className="profile-header">
        <img
          src={user.avatar || '/default-avatar.png'}
          alt={\`\${user.name}'s avatar\`}
          className="avatar"
        />
        <div className="user-info">
          <h1>{user.name}</h1>
          <p className="user-title">{user.title}</p>
          <span className="user-status" data-status={user.active ? 'active' : 'inactive'}>
            {user.active ? '● Online' : '○ Offline'}
          </span>
        </div>
      </header>

      <section className="contact-info">
        <h3>Contact Information</h3>
        <div className="contact-grid">
          <div className="contact-item">
            <strong>Email:</strong>
            <a href={\`mailto:\${user.email}\`}>{user.email}</a>
          </div>
          <div className="contact-item">
            <strong>Phone:</strong>
            <a href={\`tel:\${user.phone}\`}>{user.phone}</a>
          </div>
          <div className="contact-item">
            <strong>Location:</strong>
            <span>{user.location}</span>
          </div>
        </div>
      </section>

      <section className="user-stats">
        <h3>Statistics</h3>
        <div className="stats-grid">
          {user.stats?.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="actions">
        <button
          className="btn btn-primary"
          onClick={handleEdit}
          disabled={!user.canEdit}
        >
          Edit Profile
        </button>
        <button
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={!user.canDelete}
        >
          Delete User
        </button>
      </div>
    </div>
  );
}

// Higher-order component example
const withLoading = (WrappedComponent) => {
  return function WithLoadingComponent(props) {
    return props.loading ? (
      <div className="loading">Loading...</div>
    ) : (
      <WrappedComponent {...props} />
    );
  };
};

export default UserProfile;
export { withLoading };
`,

  python: `# Monaco-Ext Python Demo with TextMate Syntax Highlighting
# This demonstrates Python syntax highlighting with regex examples
import re

def factorial(n: int) -> int:
    """Calculate factorial recursively."""
    # Base case
    if n <= 1:
        return 1
    # Recursive case
    return n * factorial(n - 1)

# Regular expression examples
email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
phone_pattern = r'^\(\d{3}\)\s\d{3}-\d{4}$'

# URL validation pattern
url_pattern = r'^https?://(?:[-\w.])+(?::[0-9]+)?(?:/(?:[\w/_.])*)?(?:\?(?:[\w&=%.])*)?(?:#(?:\w*))?$'

# More complex regex examples
hex_color_pattern = r'^#(?:[0-9a-fA-F]{3}){1,2}$'
ipv4_pattern = r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'

# Password strength regex (at least 8 chars, 1 upper, 1 lower, 1 digit)
password_pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$'

# Email validation function
def validate_email(email: str) -> bool:
    return bool(re.match(email_pattern, email))

# Test regex patterns with examples
test_data = [
    ("user@example.com", email_pattern),
    ("invalid.email", email_pattern),
    ("test@domain.co.uk", email_pattern),
    ("(555) 123-4567", phone_pattern),
    ("555-1234", phone_pattern),
    ("#FF0000", hex_color_pattern),
    ("#123", hex_color_pattern),
    ("192.168.1.1", ipv4_pattern),
    ("999.999.999.999", ipv4_pattern)
]

for test_string, pattern in test_data:
    is_match = bool(re.match(pattern, test_string))
    print(f"'{test_string}' matches pattern: {is_match}")

# Calculate some factorials
print(f"Factorial of 5: {factorial(5)}")
print(f"Factorial of 10: {factorial(10)}")

# Example class with type hints
class Person:
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

    def greet(self) -> str:
        return f"Hello, my name is {self.name} and I am {self.age} years old."

    @property
    def is_adult(self) -> bool:
        return self.age >= 18

# Create instances
alice = Person("Alice", 28)
print(alice.greet())
print(f"Alice is adult: {alice.is_adult}")
`,

  jsx: `// Monaco-Ext JSX/React Demo with TextMate Syntax Highlighting
import React, { useState, useEffect } from 'react';

// Component with hooks and regex validation examples
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ email: '', phone: '', website: '' });
  const [validationErrors, setValidationErrors] = useState({});

  // Comprehensive regex patterns for validation
  const validationPatterns = {
    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    phone: /^(\+?\d{1,4}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/,
    website: /^https?:\/\/(?:[-\w.])+(?::[0-9]+)?(?:\/(?:[\w/_.])*)?(?:\?(?:[\w&=%.])*)?(?:#(?:\w*))?$/,
    zipCode: /^\d{5}(-\d{4})?$/,
    creditCard: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/,
    strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  };

  useEffect(() => {
    // Async data fetching with input validation
    const fetchUser = async () => {
      if (!userId || !/^\d+$/.test(userId.toString())) {
        console.warn('Invalid user ID format');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();

        // Validate fetched data using regex
        if (userData.email && !validationPatterns.email.test(userData.email)) {
          console.warn('Server returned invalid email format:', userData.email);
        }

        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // Real-time form validation with regex
  const validateField = (field, value) => {
    const errors = { ...validationErrors };

    switch (field) {
      case 'email':
        if (value && !validationPatterns.email.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;

      case 'phone':
        if (value && !validationPatterns.phone.test(value)) {
          errors.phone = 'Phone format: (123) 456-7890 or +1-123-456-7890';
        } else {
          delete errors.phone;
        }
        break;

      case 'website':
        if (value && !validationPatterns.website.test(value)) {
          errors.website = 'Please enter a valid URL (http:// or https://)';
        } else {
          delete errors.website;
        }
        break;
    }

    setValidationErrors(errors);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  // Text processing with regex examples
  const processUserText = (text) => {
    // Replace URLs with links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const withLinks = text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');

    // Highlight @mentions
    const mentionRegex = /@(\w+)/g;
    const withMentions = withLinks.replace(mentionRegex, '<span class="mention">@$1</span>');

    // Format hashtags
    const hashtagRegex = /#(\w+)/g;
    const withHashtags = withMentions.replace(hashtagRegex, '<span class="hashtag">#$1</span>');

    return withHashtags;
  };

  // Event handlers
  const handleSubmit = (e) => {
    e.preventDefault();

    // Final validation before submission
    const errors = {};
    Object.keys(validationPatterns).forEach(field => {
      const value = formData[field];
      if (value && !validationPatterns[field].test(value)) {
        errors[field] = \`Invalid \${field} format\`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    console.log('Form submitted with valid data:', formData);
  };

  const handleDelete = () => {
    // Confirmation with regex validation
    const confirmRegex = /^(yes|y|confirm)$/i;
    const confirmation = prompt('Type "yes", "y", or "confirm" to delete:');

    if (confirmation && confirmRegex.test(confirmation.trim())) {
      console.log('User deletion confirmed');
    } else {
      console.log('Deletion cancelled');
    }
  };

  // Conditional rendering with JSX
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading user profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <h2>User not found</h2>
        <p>The requested user could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <header className="profile-header">
        <img
          src={user.avatar || '/default-avatar.png'}
          alt={\`\${user.name}'s avatar\`}
          className="avatar"
          onError={(e) => { e.target.src = '/default-avatar.png'; }}
        />
        <div className="user-info">
          <h1>{user.name}</h1>
          <p className="user-title">{user.title}</p>
          <span
            className={\`user-status status-\${user.active ? 'active' : 'inactive'}\`}
            data-status={user.active ? 'active' : 'inactive'}
          >
            {user.active ? '● Online' : '○ Offline'}
          </span>
        </div>
      </header>

      <section className="contact-info">
        <h3>Contact Information</h3>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="user@example.com"
              className={validationErrors.email ? 'error' : ''}
            />
            {validationErrors.email && (
              <span className="error-message">{validationErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
              className={validationErrors.phone ? 'error' : ''}
            />
            {validationErrors.phone && (
              <span className="error-message">{validationErrors.phone}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="website">Website:</label>
            <input
              type="url"
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://example.com"
              className={validationErrors.website ? 'error' : ''}
            />
            {validationErrors.website && (
              <span className="error-message">{validationErrors.website}</span>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            Update Contact Info
          </button>
        </form>
      </section>

      <section className="user-stats">
        <h3>Statistics</h3>
        <div className="stats-grid">
          {user.stats?.map((stat, index) => (
            <div key={\`stat-\${index}\`} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-trend">
                {stat.trend > 0 ? '📈' : stat.trend < 0 ? '📉' : '➡️'}
              </div>
            </div>
          )) || (
            <p className="no-stats">No statistics available</p>
          )}
        </div>
      </section>

      <section className="user-bio">
        <h3>Bio</h3>
        <div
          className="bio-content"
          dangerouslySetInnerHTML={{
            __html: user.bio ? processUserText(user.bio) : 'No bio available'
          }}
        />
      </section>

      <div className="actions">
        <button
          className="btn btn-primary"
          onClick={() => console.log('Edit profile clicked')}
          disabled={!user.canEdit}
        >
          Edit Profile
        </button>
        <button
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={!user.canDelete}
        >
          Delete User
        </button>
      </div>
    </div>
  );
}

// Higher-order component example with regex validation
const withValidation = (WrappedComponent, validationRules) => {
  return function WithValidationComponent(props) {
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
      const validateProps = () => {
        for (const [key, rule] of Object.entries(validationRules)) {
          const value = props[key];
          if (value !== undefined && !rule.test(value)) {
            setIsValid(false);
            return;
          }
        }
        setIsValid(true);
      };

      validateProps();
    }, [props]);

    if (!isValid) {
      return (
        <div className="validation-error">
          Invalid props provided to component
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

// Usage example with email validation HOC
const EmailComponent = ({ email }) => <div>Email: {email}</div>;
const ValidatedEmailComponent = withValidation(EmailComponent, {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
});

export default UserProfile;
export { withValidation, ValidatedEmailComponent };
`,

  typescript: `// Monaco-Ext TypeScript Demo with Enhanced Syntax Highlighting
// This demonstrates TypeScript-specific features

// Interface definitions
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean; // Optional property
  roles: Role[];
}

interface Role {
  id: number;
  name: string;
  permissions: string[];
}

// Type aliases and unions
type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;

// Generic interface
interface Repository<T> {
  findById(id: ID): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<boolean>;
}

// Enum with string values
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

// Class with TypeScript features
class UserService implements Repository<User> {
  private users: Map<ID, User> = new Map();

  constructor(private readonly config: { debug: boolean }) {}

  async findById(id: ID): Promise<User | null> {
    const user = this.users.get(id);
    if (this.config.debug) {
      console.log(\`Finding user with ID: \${id}\`);
    }
    return user ?? null;
  }

  async save(user: User): Promise<User> {
    // Input validation with type guards
    if (!this.isValidUser(user)) {
      throw new Error('Invalid user data');
    }

    this.users.set(user.id, { ...user });
    return user;
  }

  async delete(id: ID): Promise<boolean> {
    return this.users.delete(id);
  }

  private isValidUser(user: any): user is User {
    return (
      typeof user === 'object' &&
      typeof user.id === 'number' &&
      typeof user.name === 'string' &&
      typeof user.email === 'string' &&
      Array.isArray(user.roles)
    );
  }

  // Generic method with constraints
  async findByProperty<K extends keyof User>(
    property: K,
    value: User[K]
  ): Promise<User[]> {
    const result: User[] = [];
    for (const user of this.users.values()) {
      if (user[property] === value) {
        result.push(user);
      }
    }
    return result;
  }
}

// Advanced TypeScript features
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type UserUpdate = DeepPartial<Pick<User, 'name' | 'email' | 'isActive'>>;

// Decorator (experimental)
function log(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(\`Calling \${propertyName} with arguments:\`, args);
    return method.apply(this, args);
  };
}

// Async/await with proper typing
async function fetchUserData(userId: ID): Promise<User | null> {
  try {
    const service = new UserService({ debug: true });
    const user = await service.findById(userId);

    if (user) {
      console.log(\`Found user: \${user.name} <\${user.email}>\`);
      return user;
    }

    console.log('User not found');
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Utility types and conditional types
type NonNullable<T> = T extends null | undefined ? never : T;
type ApiResponse<T> = {
  data: T;
  status: 'success' | 'error';
  message?: string;
};

// Module augmentation example
declare global {
  interface Array<T> {
    findByProperty<K extends keyof T>(property: K, value: T[K]): T | undefined;
  }
}

// Implementation would extend Array prototype (not shown for brevity)

// Usage examples
const userService = new UserService({ debug: true });

const sampleUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  isActive: true,
  roles: [
    {
      id: 1,
      name: UserRole.USER,
      permissions: ['read', 'write']
    }
  ]
};

// Type-safe operations
userService.save(sampleUser).then(savedUser => {
  console.log('User saved:', savedUser);
});

fetchUserData(1).then(user => {
  if (user) {
    console.log(\`User status: \${user.isActive ? 'Active' : 'Inactive'}\`);
  }
});
`,

  json: `{
  "name": "monaco-ext-demo",
  "version": "1.0.0",
  "description": "Monaco Editor Extended with TextMate syntax highlighting",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "dev": "webpack serve --config webpack.dev.config.js",
    "build": "webpack --mode=production",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  },
  "keywords": [
    "monaco-editor",
    "textmate",
    "syntax-highlighting",
    "code-editor",
    "web-editor"
  ],
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com",
    "url": "https://github.com/yourusername"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/monaco-ext.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/monaco-ext/issues"
  },
  "homepage": "https://github.com/yourusername/monaco-ext#readme",
  "dependencies": {
    "monaco-editor": "^0.45.0",
    "vscode-textmate": "^9.0.0",
    "vscode-oniguruma": "^2.0.1"
  },
  "devDependencies": {
    "@babel/core": "^7.23.0",
    "@babel/preset-env": "^7.23.0",
    "babel-loader": "^9.1.0",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.0",
    "webpack-dev-server": "^4.15.0",
    "html-webpack-plugin": "^5.5.0",
    "css-loader": "^6.8.0",
    "style-loader": "^3.3.0",
    "file-loader": "^6.2.0",
    "copy-webpack-plugin": "^11.0.0",
    "jest": "^29.7.0",
    "eslint": "^8.52.0",
    "prettier": "^3.0.0",
    "@types/jest": "^29.5.0"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ],
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
    "moduleNameMapping": {
      "\\\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.test.{js,jsx,ts,tsx}",
      "!src/**/index.js"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  },
  "eslintConfig": {
    "env": {
      "browser": true,
      "es2021": true,
      "jest": true
    },
    "extends": ["eslint:recommended"],
    "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module"
    },
    "rules": {
      "no-console": "warn",
      "no-unused-vars": "error",
      "prefer-const": "error"
    }
  },
  "prettier": {
    "semi": false,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5"
  }
}`,

  xml: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC
  "-//Apache Software Foundation//DTD Log4J Configuration//EN"
  "http://logging.apache.org/log4j/docs/dtd/log4j.dtd">

<!-- Monaco-Ext XML Demo with TextMate Syntax Highlighting -->
<configuration xmlns="http://example.com/config"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xsi:schemaLocation="http://example.com/config config.xsd">

  <!-- Application Configuration -->
  <appSettings>
    <add key="applicationName" value="Monaco-Ext Demo" />
    <add key="version" value="1.0.0" />
    <add key="debug" value="true" />
    <add key="maxUsers" value="1000" />
  </appSettings>

  <!-- Database Configuration -->
  <connectionStrings>
    <add name="defaultConnection"
         connectionString="Server=localhost;Database=MonacoExtDemo;Trusted_Connection=true;"
         providerName="System.Data.SqlClient" />
    <add name="redisConnection"
         connectionString="localhost:6379"
         providerName="Redis.Client" />
  </connectionStrings>

  <!-- Logging Configuration -->
  <log4j:configuration xmlns:log4j="http://jakarta.apache.org/log4j/">
    <!-- Console Appender -->
    <appender name="ConsoleAppender" class="org.apache.log4j.ConsoleAppender">
      <param name="Target" value="System.out"/>
      <layout class="org.apache.log4j.PatternLayout">
        <param name="ConversionPattern" value="%-5p %c{1} - %m%n"/>
      </layout>
    </appender>

    <!-- File Appender -->
    <appender name="FileAppender" class="org.apache.log4j.FileAppender">
      <param name="File" value="logs/application.log"/>
      <param name="Append" value="true"/>
      <layout class="org.apache.log4j.PatternLayout">
        <param name="ConversionPattern" value="%d{ISO8601} %-5p %c{1} - %m%n"/>
      </layout>
    </appender>

    <!-- Root Logger -->
    <root>
      <priority value="INFO"/>
      <appender-ref ref="ConsoleAppender"/>
      <appender-ref ref="FileAppender"/>
    </root>
  </log4j:configuration>

  <!-- Feature Configuration -->
  <features>
    <feature name="syntax-highlighting" enabled="true">
      <settings>
        <theme>vs-dark</theme>
        <languages>
          <language id="javascript" enabled="true" />
          <language id="typescript" enabled="true" />
          <language id="python" enabled="true" />
          <language id="json" enabled="true" />
          <language id="xml" enabled="true" />
        </languages>
      </settings>
    </feature>

    <feature name="auto-resize" enabled="false">
      <settings>
        <minHeight>200</minHeight>
        <maxHeight>800</maxHeight>
      </settings>
    </feature>

    <feature name="line-selection" enabled="true">
      <settings>
        <multiSelect>true</multiSelect>
        <highlightColor>#3399ff</highlightColor>
      </settings>
    </feature>
  </features>

  <!-- User Preferences -->
  <userPreferences>
    <preference key="editor.theme" value="github-dark" />
    <preference key="editor.fontSize" value="14" />
    <preference key="editor.wordWrap" value="on" />
    <preference key="editor.minimap.enabled" value="true" />
    <preference key="editor.lineNumbers" value="on" />
  </userPreferences>

  <!-- API Configuration -->
  <api baseUrl="https://api.example.com/v1">
    <endpoints>
      <endpoint name="users"
                url="/users"
                method="GET"
                timeout="30000"
                retries="3" />
      <endpoint name="createUser"
                url="/users"
                method="POST"
                timeout="10000" />
      <endpoint name="updateUser"
                url="/users/{id}"
                method="PUT"
                timeout="10000" />
      <endpoint name="deleteUser"
                url="/users/{id}"
                method="DELETE"
                timeout="5000" />
    </endpoints>

    <authentication type="bearer">
      <token>your-api-token-here</token>
    </authentication>
  </api>

  <!-- Performance Settings -->
  <performance>
    <cache enabled="true" ttl="3600" maxSize="1000" />
    <compression enabled="true" level="6" />
    <monitoring enabled="true">
      <metrics>
        <metric name="requests_per_second" enabled="true" />
        <metric name="response_time" enabled="true" />
        <metric name="error_rate" enabled="true" />
      </metrics>
    </monitoring>
  </performance>

  <!-- Security Configuration -->
  <security>
    <cors enabled="true">
      <allowedOrigins>
        <origin>http://localhost:3000</origin>
        <origin>https://example.com</origin>
      </allowedOrigins>
      <allowedMethods>
        <method>GET</method>
        <method>POST</method>
        <method>PUT</method>
        <method>DELETE</method>
      </allowedMethods>
    </cors>

    <rateLimit>
      <rule path="/api/*" requests="100" window="60" />
      <rule path="/auth/*" requests="10" window="60" />
    </rateLimit>
  </security>

  <!-- Data Processing Pipeline -->
  <pipeline>
    <stages>
      <stage name="validation" order="1" enabled="true">
        <processor type="schema-validator">
          <config schemaFile="schemas/input.xsd" />
        </processor>
      </stage>

      <stage name="transformation" order="2" enabled="true">
        <processor type="xslt-transformer">
          <config>
            <stylesheet>transforms/normalize.xsl</stylesheet>
            <parameters>
              <param name="version" value="2.0" />
              <param name="strict" value="true" />
            </parameters>
          </config>
        </processor>
      </stage>

      <stage name="enrichment" order="3" enabled="true">
        <processor type="data-enricher">
          <config>
            <source type="database" connection="defaultConnection" />
            <lookupFields>
              <field name="userId" target="user.details" />
              <field name="categoryId" target="category.info" />
            </lookupFields>
          </config>
        </processor>
      </stage>
    </stages>
  </pipeline>

  <!-- Custom Configuration Section -->
  <custom>
    <![CDATA[
      This is a CDATA section that can contain any text,
      including special characters like < > & " '
      and even XML-like content that won't be parsed:

      <not-real-xml>
        <fake-element attribute="value">Content</fake-element>
      </not-real-xml>
    ]]>
  </custom>

</configuration>`
};

// DOM elements
const statusElement = document.getElementById('status');
const themeSelector = document.getElementById('theme-selector');
const languageSelector = document.getElementById('language-selector');
const toggleReadonlyBtn = document.getElementById('toggle-readonly');
const toggleLineSelBtn = document.getElementById('toggle-feature-lineSel');
const toggleHighlightBtn = document.getElementById('toggle-feature-highlight');
const toggleResizeBtn = document.getElementById('toggle-feature-resize');
const lineInput = document.getElementById('line-input');
const highlightLineBtn = document.getElementById('highlight-line');
const clearHighlightsBtn = document.getElementById('clear-highlights');
const debugTextMateBtn = document.getElementById('debug-textmate');

// Feature state tracking
const featureState = {
  readOnlyLines: false,
  lineSelection: false,
  highlight: false,
  autoResize: false
};

// Helper function to update status
function updateStatus(message) {
  const timestamp = new Date().toLocaleTimeString();
  statusElement.innerHTML = `[${timestamp}] ${message}<br>${statusElement.innerHTML}`;
  // Limit status history
  if (statusElement.innerHTML.split('<br>').length > 10) {
    statusElement.innerHTML = statusElement.innerHTML.split('<br>').slice(0, 10).join('<br>');
  }
}

// Initialize the editor
let editor;
let readOnlyLinesFeature;
let lineSelectionFeature;
let highlightFeature;
let autoResizeFeature;

async function initEditor() {
  try {
    updateStatus('Initializing editor...');

    // Try to load TextMate grammars first
    try {
      updateStatus('Loading TextMate grammars...');
      console.log('Starting TextMate grammar loading...');
      await ExtendableCodeEditor.loadTextMateGrammars();
      console.log('TextMate grammars loaded successfully');
      updateStatus('TextMate grammars loaded successfully');

      // Get supported languages
      const supportedLanguages = ExtendableCodeEditor.getSupportedLanguages();
      console.log('Supported languages:', supportedLanguages);
      updateStatus(`Supported languages: ${supportedLanguages.join(', ')}`);

      // Also check what languages Monaco knows about
      const registeredLanguages = monaco.languages.getLanguages();
      console.log('Monaco registered languages:', registeredLanguages.map(l => l.id));
      updateStatus(`Monaco languages: ${registeredLanguages.map(l => l.id).join(', ')}`);
    } catch (textMateError) {
      console.error('TextMate loading failed:', textMateError);
      updateStatus(`TextMate loading failed: ${textMateError.message}`);
      updateStatus('Using basic Monaco highlighting instead');
    }

    // Create a new editor instance
    updateStatus('Creating editor instance...');
    editor = new ExtendableCodeEditor(
      document.getElementById('editor-container'),
      {
        language: 'javascript',
        value: sampleCode.javascript,
        minimap: { enabled: true },
        lineNumberOffset: 0,
        wordWrap: true,
        readOnly: false,
        enableTextMate: true, // Enable TextMate syntax highlighting
      }
    );
    updateStatus('Editor instance created');

    // Test if TextMate is actually working
    const model = editor.editor.getModel();
    if (model) {
      // Set a test code snippet that should show TextMate vs basic highlighting
      const testSnippet = 'const test = `Hello ${name}!`; // template literal';
      model.setValue(testSnippet);

      // Try to get tokenization info
      try {
        const tokens = monaco.editor.tokenize(testSnippet, 'javascript');
        updateStatus('OK Tokenization working, tokens: ' + tokens.length);

        // Look for TextMate-specific tokens
        const hasTextMateTokens = tokens.some(tokenLine =>
          tokenLine.some(token =>
            token.type && (
              token.type.includes('string.template') ||
              token.type.includes('punctuation.definition.template') ||
              token.type.includes('meta.template.expression')
            )
          )
        );

        if (hasTextMateTokens) {
          updateStatus('OK TextMate appears to be working! (found template literal tokens)');
        } else {
          updateStatus('⚠ TextMate may not be working (no template literal tokens found)');
          updateStatus('Token types found: ' + tokens.map(line => line.map(t => t.type).join(',')).join(';'));
        }
      } catch (tokenError) {
        updateStatus('X Tokenization failed: ' + tokenError.message);
      }
    }

    // Load available themes
    updateStatus('Loading themes...');
    await ExtendableCodeEditor.loadThemes(() => Promise.resolve(themes));
    updateStatus('Themes loaded');

    // Set initial theme from the selected option in HTML
    const initialTheme = themeSelector.value || 'github-light';
    ExtendableCodeEditor.changeTheme(initialTheme);

    // Apply light/dark class to editors-container based on initial theme
    const editorsContainer = document.querySelector('.editors-container');
    if (initialTheme.includes('dark')) {
      editorsContainer.classList.remove('light');
      editorsContainer.classList.add('dark');
    } else {
      editorsContainer.classList.remove('dark');
      editorsContainer.classList.add('light');
    }

    updateStatus(`Theme set to ${initialTheme}`);

    // Set the sample code back
    if (model) {
      model.setValue(sampleCode.javascript);
    }

    updateStatus('Editor initialized successfully');

    // Setup event listeners
    setupEventListeners();

  } catch (error) {
    console.error('Failed to initialize editor:', error);
    updateStatus(`Error: ${error.message}`);
    updateStatus(`Stack: ${error.stack}`);
  }
}

function setupEventListeners() {
  // Theme selector
  themeSelector.addEventListener('change', (e) => {
    const theme = e.target.value;
    ExtendableCodeEditor.changeTheme(theme);

    // Add light or dark class to editors-container based on theme
    const editorsContainer = document.querySelector('.editors-container');
    if (theme.includes('dark')) {
      editorsContainer.classList.remove('light');
      editorsContainer.classList.add('dark');
    } else {
      editorsContainer.classList.remove('dark');
      editorsContainer.classList.add('light');
    }

    updateStatus(`Theme changed to ${theme}`);
  });

  // Language selector
  languageSelector.addEventListener('change', (e) => {
    const selectedValue = e.target.value;

    // Map display names to Monaco language IDs and sample code keys
    const languageMap = {
      'javascript': { monacoId: 'javascript', codeKey: 'javascript' },
      'typescript': { monacoId: 'typescript', codeKey: 'typescript' },
      'python': { monacoId: 'python', codeKey: 'python' },
      'jsx': { monacoId: 'javascriptreact', codeKey: 'jsx' },
      'json': { monacoId: 'json', codeKey: 'json' },
      'xml': { monacoId: 'xml', codeKey: 'xml' }
    };

    const config = languageMap[selectedValue];
    if (!config) {
      updateStatus(`Unknown language: ${selectedValue}`);
      return;
    }

    const code = sampleCode[config.codeKey];
    if (!code) {
      updateStatus(`No sample code for: ${config.codeKey}`);
      return;
    }

    // Update the editor model
    const model = editor.editor.getModel();
    if (model) {
      model.setValue(code);
      monaco.editor.setModelLanguage(model, config.monacoId);
      updateStatus(`Language changed to ${config.monacoId} (${selectedValue})`);
    }
  });

  // Set initial button text based on feature state
  toggleReadonlyBtn.textContent = featureState.readOnlyLines ? 'Disable Read-only Lines' : 'Enable Read-only Lines (1-3 & 5)';
  toggleLineSelBtn.textContent = featureState.lineSelection ? 'Disable Line Selection' : 'Enable Line Selection';
  toggleHighlightBtn.textContent = featureState.highlight ? 'Disable Highlight' : 'Enable Highlight';
  toggleResizeBtn.textContent = featureState.autoResize ? 'Disable Auto Resize' : 'Enable Auto Resize';

  // Toggle read-only lines (lines 1-3)
  toggleReadonlyBtn.addEventListener('click', () => {
    if (featureState.readOnlyLines) {
      editor.features.remove('readOnlyLines');
      featureState.readOnlyLines = false;
      toggleReadonlyBtn.textContent = 'Enable Read-only Lines (1-3 & 5)';
      updateStatus('Read-only lines disabled');
    } else {
      readOnlyLinesFeature = editor.features.add('readOnlyLines', new ReadOnlyLines([1, 2, 3, 5]));
      featureState.readOnlyLines = true;
      toggleReadonlyBtn.textContent = 'Disable Read-only Lines';
      updateStatus('Lines 1-3 are now read-only');
    }
  });

  // Toggle line selection feature
  toggleLineSelBtn.addEventListener('click', () => {
    if (featureState.lineSelection) {
      editor.features.remove('lineSelection');
      featureState.lineSelection = false;
      toggleLineSelBtn.textContent = 'Enable Line Selection';
      updateStatus('Line selection disabled');
    } else {
      lineSelectionFeature = editor.features.add('lineSelection', new LineSelection());
      featureState.lineSelection = true;
      toggleLineSelBtn.textContent = 'Disable Line Selection';
      updateStatus('Line selection enabled - click on line numbers');
    }
  });

  // Toggle highlight feature
  toggleHighlightBtn.addEventListener('click', () => {
    if (featureState.highlight) {
      editor.features.remove('highlight');
      featureState.highlight = false;
      toggleHighlightBtn.textContent = 'Enable Highlight';
      updateStatus('Highlight feature disabled');
    } else {
      highlightFeature = editor.features.add('highlight', new HighLight());
      featureState.highlight = true;
      toggleHighlightBtn.textContent = 'Disable Highlight';
      updateStatus('Highlight feature enabled');
    }
  });

  // Toggle auto-resize feature
  toggleResizeBtn.addEventListener('click', () => {
    if (featureState.autoResize) {
      editor.features.remove('autoResize');
      featureState.autoResize = false;
      toggleResizeBtn.textContent = 'Enable Auto Resize';
      updateStatus('Auto-resize disabled');
      document.getElementById('editor-container').style.height = '400px';
    } else {
      autoResizeFeature = editor.features.add('autoResize', new AutoResizeHeight());
      featureState.autoResize = true;
      toggleResizeBtn.textContent = 'Disable Auto Resize';
      updateStatus('Auto-resize enabled');
    }
  });

  // Highlight line button
  highlightLineBtn.addEventListener('click', () => {
    const lineNumber = parseInt(lineInput.value, 10);
    if (isNaN(lineNumber) || lineNumber < 1) {
      updateStatus('Please enter a valid line number');
      return;
    }

    if (!featureState.highlight) {
      highlightFeature = editor.features.add('highlight', new HighLight());
      featureState.highlight = true;
      toggleHighlightBtn.textContent = 'Disable Highlight';
    }

    editor.eventChannel.emit('editor.highlight', [lineNumber]);
    updateStatus(`Highlighted line ${lineNumber}`);
  });

  // Clear highlights button
  clearHighlightsBtn.addEventListener('click', () => {
    if (featureState.highlight) {
      editor.eventChannel.emit('editor.highlight', []);
      updateStatus('Cleared all highlights');
    }
  });

  // Debug TextMate button
  debugTextMateBtn.addEventListener('click', async () => {
    updateStatus('=== TextMate Debug Information ===');

    try {
      // Check if TextMate service is initialized
      const { TextMateService } = await import('../src/textmate/index.js');
      const service = TextMateService.getInstance();
      updateStatus('OK TextMate service is initialized');

      // Check current model language
      const model = editor.editor.getModel();
      const currentLanguage = model ? monaco.editor.getModel(model.uri)?.getLanguageId() || model.getLanguageId() : 'unknown';
      updateStatus('Current language: ' + currentLanguage);

      // Check if model has tokens (indicates TextMate is working)
      if (model) {
        const lineCount = model.getLineCount();
        updateStatus('Model has ' + lineCount + ' lines');

        // Get tokenization for first line to see if TextMate is working
        const firstLineTokens = monaco.editor.tokenize(model.getLineContent(1), currentLanguage);
        updateStatus('First line tokens: ' + JSON.stringify(firstLineTokens));
      }

      // Test setting a complex code sample that should show TextMate differences
      const testCode = '// TextMate Test Code\nconst greeting = `Hello ${name}!`;\nasync function test() { await fetch("/api"); }';

      model.setValue(testCode);
      updateStatus('OK Set test code - check if syntax highlighting is enhanced');

    } catch (error) {
      updateStatus('X TextMate debug failed: ' + error.message);
      console.error('TextMate debug error:', error);
    }
  });

  // Listen to editor events
  editor.eventChannel.addListener('editor.selectLine', (lineNumber) => {
    updateStatus(`Line ${lineNumber} selected`);
  });

  editor.eventChannel.addListener('editor.height', (height) => {
    updateStatus(`Editor height changed to ${height}px`);
  });

  // List active features
  const listFeaturesBtn = document.createElement('button');
  listFeaturesBtn.textContent = 'List Active Features';
  listFeaturesBtn.addEventListener('click', () => {
    const activeFeatures = editor.features.list();
    updateStatus(`Active features: ${activeFeatures.join(', ') || 'none'}`);
  });

  document.querySelector('.controls').appendChild(listFeaturesBtn);
}

// Initialize the editor when the DOM is ready
document.addEventListener('DOMContentLoaded', initEditor);