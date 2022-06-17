/** A dependency an app could have */
export type Dependency = 'bitcoind' | 'electrum' | 'lnd'  | 'c-lightning';
/**
 * Defines an app
 */
export type OldApp = {
  /** The id of the app, the name as a simple string without spaces */
  id: string;
  /** A category for the app, used for grouping apps on the dashboard */
  category: string;
  /** The name of the app */
  name: string;
  /** The version of the app */
  version: string;
  /** A One line description of the app (max 50 characters) */
  tagline: string;
  /** A longer description of the app (50 to 200 words) */
  description: string;
  /** The person(s) who created the app */
  developer?: string;
  /** The person(s) who created the app */
  developers?: Record<string, string>;
  /** The dependencies of the app */
  dependencies: (Dependency | Dependency[])[];
  /** The url to the app's Git repository */
  repo: string | Record<string, string>;
  /** The url to the app's support website/chat */
  support: string;
  /** The port the app's web UI uses */
  port: number;
  /** A list of links to app promotional images, if no domain is provided, https://runcitadel.github.io/old-apps-gallery/${app.id}/ will be put in front of the path */
  gallery: string[];
  /** The path of the app the open button should open */
  path: string;
  /** The app's default password */
  defaultPassword: string;
  /** Automatically added */
  hiddenService?: string;
  /** Automatically added */
  installed?: boolean;
  /** Automatically added */
  compatible: boolean;
};

export type MetadataV4 = {
  /**
   * The category for the app
   */
  category: string;
  /**
   * The app's default password. Can also be $APP_SEED for a random password
   */
  defaultPassword?: string | undefined;
  developers: Record<string, string>;
  /**
   * A list of promo images for the apps
   */
  gallery?: string[] | undefined;
  /**
   * The name of the app
   */
  name: string;
  /**
   * The path the "Open" link on the dashboard should lead to
   */
  path?: string | undefined;
  /**
   * Permissions the app requires
   */
  permissions?: Array<string | string[]>;
  /**
   * App repository name -> repo URL
   */
  repo: Record<string, string>;
  /**
   * A support link for the app
   */
  support: string;
  /**
   * A short tagline for the app
   */
  tagline: string;
  /**
   * True if the app only works over Tor
   */
  torOnly?: boolean;
  /**
   * A list of containers to update automatically (still validated by the Citadel team)
   */
  updateContainers?: string[] | undefined;
  /**
   * The version of the app
   */
  version: string;
  /** Automatically added */
  hiddenService?: string;
  /** Automatically added */
  installed?: boolean;
  /** Automatically added */
  compatible: boolean;
};

export type app = MetadataV4 | OldApp;

type BuildPowersOf2LengthArrays<
  N extends number,
  R extends never[][],
> = R[0][N] extends never
  ? R
  : BuildPowersOf2LengthArrays<N, [[...R[0], ...R[0]], ...R]>;
type ConcatLargestUntilDone<
  N extends number,
  R extends never[][],
  B extends never[],
> = B['length'] extends N
  ? B
  : [...R[0], ...B][N] extends never
  ? ConcatLargestUntilDone<
      N,
      R extends [R[0], ...infer U] ? (U extends never[][] ? U : never) : never,
      B
    >
  : ConcatLargestUntilDone<
      N,
      R extends [R[0], ...infer U] ? (U extends never[][] ? U : never) : never,
      [...R[0], ...B]
    >;
type Replace<R extends unknown[], T> = {
  [K in keyof R]: T;
};
type TupleOf<T, N extends number> = number extends N
  ? T[]
  : {
      [K in N]: BuildPowersOf2LengthArrays<K, [[never]]> extends infer U
        ? U extends never[][]
          ? Replace<ConcatLargestUntilDone<K, U, []>, T>
          : never
        : never;
    }[N];
export type RangeOf<N extends number> = Partial<TupleOf<unknown, N>>['length'];
export type RangeOf2<From extends number, To extends number> =
  | Exclude<RangeOf<To>, RangeOf<From>>
  | From;
/** An update status file */
export type updateStatus = {
  state: 'installing' | 'success' | 'failed';
  progress: RangeOf2<0, 100>;
  description: string;
  updateTo?: string;
};
export type versionFile = {
  version: string;
  name: string;
  requires: string;
  notes: string;
};
export type backupStatus = {
  status: 'success' | 'failed';
  /** A unix timestamp of when the backup was created */
  timestamp: number;
};
export type debugStatus = {
  status: 'requested' | 'processing' | 'success';
  debug: string;
  /** The dmesg logs */
  dmesg: string;
};
export type systemStatus = {
  type: 'reboot' | 'shutdown';
  status: 'requested';
};

export type connectionDetails = {
  address: string;
  port: number;
  connectionString: string;
};

export type RpcConnectionDetails = connectionDetails & {
  rpcuser: string;
  rpcpassword: string;
};

export type LndConnectionDetails = {
  restTor: string;
  restLocal: string;
  grpcTor: string;
  grpcLocal: string;
};

export type memBreakdown = {
  id: string;
  used: number;
};
export type memUsage = {
  total: number;
  used: number;
  breakdown: memBreakdown[];
};

export type RequestFunction = <ResponseType = unknown>(
  jwt: string,
  url: string,
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: unknown,
  auth?: boolean,
) => Promise<ResponseType>;
