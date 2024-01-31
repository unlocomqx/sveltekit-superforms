export function splitPath(path: string) {
	return path
		.toString()
		.split(/[[\].]+/)
		.filter((p) => p);
}

export function mergePath(path: (string | number | symbol)[]) {
	return path.reduce((acc: string, next) => {
		const key = String(next);
		if (typeof next === 'number' || /^\d+$/.test(key)) acc += `[${key}]`;
		else if (!acc) acc += key;
		else acc += `.${key}`;

		return acc;
	}, '');
}

type BuiltInObjects = Date | Set<unknown> | File;

export type AllKeys<T> = T extends T ? keyof T : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PickType<T, K extends AllKeys<T>> = T extends { [k in K]: any } ? T[K] : never;

// Thanks to https://dev.to/lucianbc/union-type-merging-in-typescript-9al
export type MergeUnion<T> = {
	[K in AllKeys<T>]: PickType<T, K>;
};

/**
 * Lists all paths in an object as string accessors.
 */
export type FormPath<T extends object> = string & StringPath<T>;
//| FormPathLeaves<T>
//| FormPathArrays<T>;

/**
 * List paths in an object as string accessors, but only with non-objects as accessible properties.
 * Similar to the leaves in a node tree, if you look at the object as a tree structure.
 */
export type FormPathLeaves<T extends object> = string & StringPathLeaves<T>;

/**
 * List all arrays in an object as string accessors.
 */
export type FormPathArrays<T extends object> = string & StringPathArrays<T>;

/*
export type StringPathArrays<T extends object, Path extends string = ''> = {
	[K in Extract<AllKeys<T>, string>]: NonNullable<T[K]> extends BuiltInObjects
		? never
		: NonNullable<T[K]> extends (infer U)[]
			?
					| `${Path}${Path extends '' ? '' : '.'}${K}`
					| StringPathArrays<NonNullable<U>, `${Path}${Path extends '' ? '' : '.'}${K}[${number}]`>
			: NonNullable<T[K]> extends object
				? StringPathArrays<NonNullable<T[K]>, `${Path}${Path extends '' ? '' : '.'}${K}`>
				: NonNullable<T> extends unknown[]
					? Path
					: never;
}[Extract<AllKeys<T>, string>];
*/

type Add<Path extends string, Next extends string> = `${Path}${Path extends '' ? '' : '.'}${Next}`;

//type FilterOn<Current, AddIf, Path> = AddIf extends Current ? Path : never;

export type StringPath<
	T extends object,
	Filter extends 'arrays' | 'leaves' | 'all' = 'all',
	ObjAppend extends string = never,
	Path extends string = ''
> = T extends BuiltInObjects
	? Filter extends 'leaves' | 'all'
		? Path
		: never
	: T extends (infer U)[]
		? Path | (U extends object ? StringPath<U, Filter, ObjAppend, `${Path}[${number}]`> : never)
		: {
				[K in Extract<AllKeys<T>, string>]: NonNullable<T[K]> extends object
					? NonNullable<T[K]> extends (infer U)[]
						?
								| (Filter extends 'arrays' | 'all' ? Add<Path, K> : never)
								| (U extends unknown[]
										? Filter extends 'arrays' | 'all'
											? Add<Path, `${K}[${number}]`>
											: never
										: Filter extends 'leaves' | 'all'
											? Add<Path, `${K}[${number}]`>
											: never)
								| (NonNullable<U> extends object
										? StringPath<NonNullable<U>, Filter, ObjAppend, Add<Path, `${K}[${number}]`>>
										: never)
						:
								| (Filter extends 'all' ? Add<Path, K> : never)
								| StringPath<NonNullable<T[K]>, Filter, ObjAppend, Add<Path, K>>
					: Filter extends 'leaves' | 'all'
						? Add<Path, K>
						: never;
			}[Extract<AllKeys<T>, string>];

export type StringPathArrays<T extends object> = StringPath<T, 'arrays'>;

/*
type StringPathOld<T extends object, Filter extends 'arrays' | 'leaves' | 'all' = 'all'> =
	NonNullable<T> extends (infer U)[]
		? NonNullable<U> extends object
			?
					| (Filter extends 'leaves' | 'all'
							? `[${number}]`
							: NonNullable<U> extends unknown[]
								? `[${number}]`
								: never)
					| `[${number}]${NonNullable<U> extends unknown[]
							? ''
							: '.'}${NonNullable<U> extends BuiltInObjects
							? never
							: StringPath<NonNullable<U>, Filter> & string}`
			: `[${number}]`
		: NonNullable<T> extends object
			?
					| (Filter extends 'leaves' | 'all'
							? AllKeys<T>
							: {
									[K in AllKeys<T>]-?: K extends string
										? NonNullable<MergeUnion<T>[K]> extends unknown[]
											? K
											: never
										: never;
								}[AllKeys<T>])
					| {
							[K in AllKeys<T>]-?: K extends string
								? NonNullable<MergeUnion<T>[K]> extends object
									? `${K}${NonNullable<MergeUnion<T>[K]> extends unknown[] ? '' : '.'}${NonNullable<
											T[K]
										> extends BuiltInObjects
											? never
											: StringPath<NonNullable<T[K]>, Filter> & string}`
									: never
								: never;
					  }[AllKeys<T>]
			: never;
*/

export type StringPathLeaves<T extends object, Arr extends string = never> =
	NonNullable<T> extends (infer U)[]
		? NonNullable<U> extends object
			?
					| (Arr extends never ? never : `.${Arr}`)
					| `[${number}]${NonNullable<U> extends unknown[] ? '' : '.'}${StringPathLeaves<
							NonNullable<U>,
							Arr
					  > &
							string}`
			: `[${number}]` | (Arr extends never ? never : `.${Arr}`)
		: NonNullable<T> extends object
			?
					| {
							[K in AllKeys<T>]: NonNullable<MergeUnion<T>[K]> extends object
								? NonNullable<T[K]> extends BuiltInObjects
									? K
									: NonNullable<T[K]> extends object
										? never
										: K
								: K;
					  }[AllKeys<T>]
					| {
							[K in AllKeys<T>]-?: K extends string
								? NonNullable<T[K]> extends object
									? `${K}${NonNullable<T[K]> extends unknown[] ? '' : '.'}${StringPathLeaves<
											NonNullable<T[K]>,
											Arr
										> &
											string}`
									: never
								: never;
					  }[AllKeys<T>]
			: never; //{never_error1: T, key: K, value: T[K]}

/*
type StringPathLeavesOld<T extends object, Arr extends string = never> =
	NonNullable<T> extends (infer U)[]
		? NonNullable<U> extends object
			?
					| (Arr extends never ? never : `.${Arr}`)
					| `[${number}]${NonNullable<U> extends unknown[] ? '' : '.'}${StringPathLeaves<
							NonNullable<U>,
							Arr
					  > &
							string}`
			: `[${number}]` | (Arr extends never ? never : `.${Arr}`)
		: NonNullable<T> extends object
			?
					| {
							[K in AllKeys<T>]: NonNullable<MergeUnion<T>[K]> extends object
								? NonNullable<T[K]> extends BuiltInObjects
									? K
									: NonNullable<T[K]> extends object
										? never
										: K
								: K;
					  }[AllKeys<T>]
					| {
							[K in AllKeys<T>]-?: K extends string
								? NonNullable<T[K]> extends object
									? `${K}${NonNullable<T[K]> extends unknown[] ? '' : '.'}${StringPathLeaves<
											NonNullable<T[K]>,
											Arr
										> &
											string}`
									: never
								: never;
					  }[AllKeys<T>]
			: never; //{never_error1: T, key: K, value: T[K]}
*/

export type FormPathType<T, P extends string> = P extends keyof T
	? T[P]
	: P extends number
		? T
		: P extends `.${infer Rest}`
			? FormPathType<NonNullable<T>, Rest>
			: P extends `${number}]${infer Rest}`
				? NonNullable<T> extends (infer U)[]
					? FormPathType<U, Rest>
					: { invalid_path1: P; Type: T }
				: P extends `${infer K}[${infer Rest}`
					? K extends keyof NonNullable<T>
						? FormPathType<NonNullable<T>[K], Rest>
						: FormPathType<T, Rest>
					: P extends `${infer K}.${infer Rest}`
						? K extends keyof NonNullable<T>
							? FormPathType<NonNullable<T>[K], Rest>
							: NonNullable<T> extends (infer U)[]
								? FormPathType<U, Rest>
								: { invalid_path2: P; Type: T }
						: P extends `[${infer K}].${infer Rest}`
							? K extends number
								? T extends (infer U)[]
									? FormPathType<U, Rest>
									: { invalid_path3: P; Type: T }
								: P extends `${number}`
									? NonNullable<T> extends (infer U)[]
										? U
										: { invalid_path4: P; Type: T }
									: P extends keyof NonNullable<T>
										? NonNullable<T>[P]
										: P extends `${number}`
											? NonNullable<T> extends (infer U)[]
												? U
												: { invalid_path5: P; Type: T }
											: { invalid_path6: P; Type: T }
							: P extends ''
								? T
								: P extends AllKeys<T>
									? MergeUnion<T>[P]
									: { invalid_path7: P; Type: T };
