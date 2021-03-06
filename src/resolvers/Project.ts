import { wrap } from "@mikro-orm/core";
import { Place } from "@root/entities/Employee";
import {
	MobilizationSession,
} from "@root/entities/MobilizationSession";
import { Project } from "@root/entities/Project";
import { MyContext, PaginatedResponse, QueryOptions, Response } from "@root/types";
import queryBuilder from "@root/utils/queryBuilder";
import { endianness } from "node:os";
import {
	Arg,
	Ctx,
	Field,
	ID,
	InputType,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from "type-graphql";

//@ts-ignore
@ObjectType()
//@ts-ignore
class ProjectResponse extends Response(Project) {}

//@ts-ignore
@ObjectType()
//@ts-ignore
class ProjectTableResponse extends PaginatedResponse(Project) {}

@InputType()
class ProjectCreateInput {
	@Field()
	name: string;

	@Field({ nullable: true })
	description?: string;

	@Field({ nullable: true })
	value?: string;

	@Field({ nullable: true })
	place?: Place;

	@Field({ nullable: true })
	companyRole?: string;

	@Field()
	progress: number;

    @Field()
    start: Date;

    @Field({ nullable: true })
    end?: Date;
}

@InputType()
class ProjectUpdateInput {
	@Field({ nullable: true })
	id: number;

	@Field({ nullable: true })
	name?: string;

	@Field({ nullable: true })
	description?: string;

	@Field({ nullable: true })
	value?: string;

	@Field({ nullable: true })
	place?: Place;

	@Field({ nullable: true })
	companyRole?: string;

	@Field({ nullable: true })
	progress?: number;

	@Field({ nullable: true })
	mobilizationSessionId: number;
}

@Resolver()
export class ProjectResolver {
	@Query(() => ProjectTableResponse)
	async getProjects(
		@Ctx() { em }: MyContext,
		@Arg("inputs", { nullable: true }) options: QueryOptions
	) {
		const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
		const list_data = await em.find(Project, filterBy, {
			limit: perPage,
			offset: perPage * (numPage - 1),
			orderBy: sortBy,
		});
		const total = await em.count(Project);
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total,
			},
		};
	}

	@Query(() => ProjectResponse)
	async getProject(@Ctx() { em }: MyContext, @Arg("id") id: number) {
		const project = await em.findOne(Project, { id });
		if (!project)
			return {
				errors: [
					{
						message: "Kh??ng t??m th???y d??? ??n",
					},
				],
			};
		return {
			result: project,
		};
	}

	@Mutation(() => ProjectResponse)
	async createProject(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: ProjectCreateInput
	) {
		const data = await em.findOne(Project, { name: inputs.name });
		if (data) 
		return {
			errors: [
				{
					message: "???? c?? d??? ??n c??ng t??n trong database!"
				},
			],
		};

		if (inputs.end && inputs.end <=  inputs.start ) {
			return {
				errors: [
					{
						message: "Th???i gian k???t th??c kh??ng ???????c s???m h??n th???i gian b???t ?????u!"
					}
				]
			}
		}
		const project = em.create(Project, inputs);
		if (inputs.place) {
			project.place = JSON.stringify(inputs.place);
		}
		try {
			await em.persistAndFlush(project);
		} catch (error) {			
			return {
				errors: [
					{
						message: error,
					},
				],
			};
		}
		return {
			result: project,
		};
	}

	@Mutation(() => ProjectResponse)
	async updateProject(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: ProjectUpdateInput
	) {
		const project = await em.findOne(Project, { id: inputs.id });
		if (!project) {
			return {
				errors: [
					{
						message: "Kh??ng t???n t???i d??? ??n n??y"
					}
				]
			}
		}
		if (inputs.mobilizationSessionId) {
			const mobilizationSession = await em.findOne(MobilizationSession, {
				id: inputs.mobilizationSessionId,
			});
			if(mobilizationSession)
			project.mobilizationSessions.add(mobilizationSession);
		}
		if (inputs.place) {
			project.place = JSON.stringify(inputs.place);
		}

		wrap(project).assign({
			...inputs,
		});

		try {
			await em.flush();
		} catch (error) {
			return {
				errors: [
					{
						message: error,
					},
				],
			};
		}
		return {
			result: project,
			message: "C???p nh???t d??? ??n th??nh c??ng"
		};
	}

	@Mutation(() => ProjectResponse)
	async deleteProject(
		@Arg("inputs") id: number,
		@Ctx() { em }: MyContext,
	) {
		const project = await em.findOne(Project, {id});
		if(project) {
			em.remove(project)
			await em.flush();
		}
		else {
			return {
				errors: {
					message: "Kh??ng t??m th???y d??? ??n",
					field: "id"
				}
			}
		}
		return {
			message: "???? xo?? d??? ??n th??nh c??ng"
		}
	}
}
