/**
 * Release Manager Common Types
 *
 * Shared types between frontend and backend plugins for the
 * Backstage Release Manager.
 */

// =============================================================================
// Environment Types
// =============================================================================

/**
 * Environment tier classification
 */
export type EnvironmentTier = 'development' | 'staging' | 'production';

/**
 * Cloud provider types
 */
export type ProviderType = 'kubernetes' | 'aws' | 'azure' | 'gcp';

/**
 * Deployment provider types (more specific than cloud provider)
 */
export type DeploymentProviderType =
  | 'kubernetes'
  | 'aws-lambda'
  | 'aws-ecs'
  | 'aws-fargate'
  | 'azure-functions'
  | 'azure-container-apps'
  | 'gcp-cloud-run'
  | 'gcp-cloud-functions';

/**
 * Kubernetes provider configuration
 */
export interface KubernetesProviderConfig {
  type: 'kubernetes';
  /** Cluster name or kubectl context */
  cluster: string;
  /** Optional direct API server URL */
  apiServer?: string;
  /** Service account token (for remote access) */
  serviceAccountToken?: string;
}

/**
 * AWS provider configuration
 */
export interface AwsProviderConfig {
  type: 'aws';
  /** AWS Account ID */
  accountId: string;
  /** AWS Region */
  region: string;
  /** AWS Profile (for local development) */
  profile?: string;
  /** IAM Role ARN to assume */
  roleArn?: string;
}

/**
 * Azure provider configuration
 */
export interface AzureProviderConfig {
  type: 'azure';
  /** Azure Subscription ID */
  subscriptionId: string;
  /** Resource Group name */
  resourceGroup: string;
  /** Azure region */
  region: string;
}

/**
 * Union type for all provider configurations
 */
export type ProviderConfig =
  | KubernetesProviderConfig
  | AwsProviderConfig
  | AzureProviderConfig;

/**
 * Environment definition
 */
export interface Environment {
  /** Unique environment name (e.g., 'staging', 'prod') */
  name: string;
  /** Display title */
  title?: string;
  /** Environment tier */
  tier: EnvironmentTier;
  /** Next environment in promotion pipeline */
  promotesTo?: string;
  /** Provider configurations for this environment */
  providers: ProviderConfig[];
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

// =============================================================================
// Deployment Types
// =============================================================================

/**
 * Kubernetes deployment target
 */
export interface KubernetesDeploymentTarget {
  provider: 'kubernetes';
  /** Kubernetes namespace */
  namespace: string;
  /** Label selector (e.g., 'app=hybris,webshop=mi2') */
  selector: string;
  /** Optional: specific deployment name */
  deploymentName?: string;
}

/**
 * AWS Lambda deployment target
 */
export interface AwsLambdaDeploymentTarget {
  provider: 'aws-lambda';
  /** Lambda function name */
  functionName: string;
  /** Optional: specific alias */
  alias?: string;
}

/**
 * AWS ECS deployment target
 */
export interface AwsEcsDeploymentTarget {
  provider: 'aws-ecs';
  /** ECS cluster name */
  cluster: string;
  /** ECS service name */
  service: string;
}

/**
 * Union type for deployment targets
 */
export type DeploymentTarget =
  | KubernetesDeploymentTarget
  | AwsLambdaDeploymentTarget
  | AwsEcsDeploymentTarget;

/**
 * Component deployment configuration per environment
 */
export interface ComponentDeployment {
  /** Environment name */
  environment: string;
  /** Deployment target configuration */
  target: DeploymentTarget;
}

// =============================================================================
// Release Types
// =============================================================================

/**
 * Release status
 */
export type ReleaseStatus = 'success' | 'failed' | 'in_progress' | 'unknown';

/**
 * Release source (what triggered the deployment)
 */
export type ReleaseSource =
  | 'jenkins'
  | 'argocd'
  | 'github-actions'
  | 'azure-devops'
  | 'manual'
  | 'unknown';

/**
 * Release record - represents a deployment event
 */
export interface Release {
  /** Unique release ID */
  id: string;
  /** Component reference (e.g., 'component:default/hybris') */
  componentRef: string;
  /** Environment name */
  environment: string;
  /** Version string (semver or custom) */
  version: string;
  /** Container image tag (if applicable) */
  imageTag?: string;
  /** Deployment timestamp */
  deployedAt: string; // ISO 8601
  /** Who triggered the deployment */
  deployedBy?: string;
  /** What triggered the deployment */
  source: ReleaseSource;
  /** Deployment status */
  status: ReleaseStatus;
  /** Associated configuration snapshot */
  configuration?: Configuration;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Current deployment info (live state)
 */
export interface DeploymentInfo {
  /** Component reference */
  componentRef: string;
  /** Environment name */
  environment: string;
  /** Current version */
  version: string;
  /** Container image (full reference) */
  image?: string;
  /** Number of desired replicas */
  desiredReplicas?: number;
  /** Number of ready replicas */
  readyReplicas?: number;
  /** Overall health status */
  healthy: boolean;
  /** Status message */
  statusMessage?: string;
  /** Last update timestamp */
  lastUpdated: string; // ISO 8601
  /** Provider-specific details */
  providerDetails?: Record<string, unknown>;
}

// =============================================================================
// Configuration Types
// =============================================================================

/**
 * Configuration value source
 */
export type ConfigSource =
  | 'kubernetes-deployment'
  | 'kubernetes-configmap'
  | 'kubernetes-secret'
  | 'aws-lambda'
  | 'aws-ssm'
  | 'aws-secrets-manager'
  | 'azure-app-config'
  | 'azure-keyvault'
  | 'environment-variable';

/**
 * Configuration value type
 */
export type ConfigValueType = 'string' | 'number' | 'boolean' | 'object' | 'array';

/**
 * Single configuration value
 */
export interface ConfigValue {
  /** Configuration key */
  key: string;
  /** Configuration value (masked if secret) */
  value: string | number | boolean | Record<string, unknown> | unknown[];
  /** Value type */
  type: ConfigValueType;
  /** Whether this is a secret (value will be masked) */
  secret: boolean;
  /** Source of the configuration */
  source: ConfigSource;
  /** Path in source (e.g., SSM parameter path) */
  sourcePath?: string;
}

/**
 * Configuration schema definition (what configs to track)
 */
export interface ConfigSchemaEntry {
  /** Configuration key */
  key: string;
  /** Description */
  description?: string;
  /** Value type */
  type: ConfigValueType;
  /** Source to fetch from */
  source: ConfigSource;
  /** Path in source (supports {env} placeholder) */
  path: string;
  /** Whether this is a secret */
  secret?: boolean;
}

/**
 * Configuration snapshot
 */
export interface Configuration {
  /** When this snapshot was captured */
  capturedAt: string; // ISO 8601
  /** Configuration values */
  values: ConfigValue[];
}

// =============================================================================
// Diff Types
// =============================================================================

/**
 * Difference status between environments
 */
export type DiffStatus = 'same' | 'different' | 'expected' | 'drift' | 'missing';

/**
 * Single configuration difference
 */
export interface ConfigDifference {
  /** Configuration key */
  key: string;
  /** Value in first environment */
  value1: ConfigValue | null;
  /** Value in second environment */
  value2: ConfigValue | null;
  /** Difference status */
  status: DiffStatus;
}

/**
 * Configuration diff result
 */
export interface ConfigDiff {
  /** Component reference */
  componentRef: string;
  /** First environment */
  environment1: string;
  /** Second environment */
  environment2: string;
  /** Timestamp of comparison */
  comparedAt: string; // ISO 8601
  /** Individual differences */
  differences: ConfigDifference[];
  /** Summary: number of same values */
  sameCount: number;
  /** Summary: number of different values */
  differentCount: number;
  /** Summary: number of missing values */
  missingCount: number;
}

// =============================================================================
// Drift Types
// =============================================================================

/**
 * Drift event type
 */
export type DriftType =
  | 'config_changed'
  | 'version_mismatch'
  | 'replica_changed'
  | 'resource_changed';

/**
 * Drift event
 */
export interface DriftEvent {
  /** Unique drift event ID */
  id: string;
  /** Component reference */
  componentRef: string;
  /** Environment name */
  environment: string;
  /** Type of drift */
  driftType: DriftType;
  /** Expected value */
  expectedValue: unknown;
  /** Actual value */
  actualValue: unknown;
  /** When drift was detected */
  detectedAt: string; // ISO 8601
  /** When drift was resolved (null if unresolved) */
  resolvedAt?: string;
  /** Who resolved the drift */
  resolvedBy?: string;
}

// =============================================================================
// Matrix Types (for overview displays)
// =============================================================================

/**
 * Single cell in the release matrix
 */
export interface ReleaseMatrixCell {
  /** Environment name */
  environment: string;
  /** Current version */
  version?: string;
  /** Short version (for display) */
  versionShort?: string;
  /** Deployment health */
  healthy: boolean;
  /** Last deployment timestamp */
  lastDeployed?: string;
  /** Has drift from expected state */
  hasDrift: boolean;
}

/**
 * Row in the release matrix (one component)
 */
export interface ReleaseMatrixRow {
  /** Component reference */
  componentRef: string;
  /** Component name */
  componentName: string;
  /** Component title */
  componentTitle?: string;
  /** Component type (service, function, website) */
  componentType?: string;
  /** Cells per environment */
  cells: Record<string, ReleaseMatrixCell>;
  /** Whether all environments have same version */
  allSameVersion: boolean;
}

/**
 * Full release matrix for a system
 */
export interface ReleaseMatrix {
  /** System reference */
  systemRef: string;
  /** System name */
  systemName: string;
  /** List of environments (columns) */
  environments: string[];
  /** Rows (one per component) */
  rows: ReleaseMatrixRow[];
  /** Generated timestamp */
  generatedAt: string; // ISO 8601
}

// =============================================================================
// API Request/Response Types
// =============================================================================

/**
 * Pagination parameters
 */
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  limit: number;
  offset: number;
}

/**
 * Filter for releases
 */
export interface ReleaseFilter extends PaginationParams {
  componentRef?: string;
  environment?: string;
  status?: ReleaseStatus;
  source?: ReleaseSource;
  fromDate?: string;
  toDate?: string;
}

/**
 * Filter for drift events
 */
export interface DriftFilter extends PaginationParams {
  componentRef?: string;
  environment?: string;
  driftType?: DriftType;
  unresolvedOnly?: boolean;
}

// =============================================================================
// Annotation Keys
// =============================================================================

/**
 * Annotation keys used by the Release Manager plugin
 */
export const RELEASE_MANAGER_ANNOTATIONS = {
  /** Marks a Resource as an Environment */
  ENVIRONMENT: 'release-manager.io/environment',
  /** Environment configuration (JSON/YAML) */
  ENVIRONMENT_CONFIG: 'release-manager.io/config',
  /** Component deployment targets (JSON/YAML) */
  DEPLOYMENTS: 'release-manager.io/deployments',
  /** Component configuration schema (JSON/YAML) */
  CONFIG_SCHEMA: 'release-manager.io/config-schema',
} as const;
