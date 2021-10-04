import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1633326500083 implements MigrationInterface {
    name = 'Migration1633326500083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fileURL" character varying NOT NULL, "language" character varying NOT NULL, "description" character varying NOT NULL, "subject" character varying, "instructor" character varying, "like_count" integer NOT NULL DEFAULT '0', "date" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "userId" uuid, CONSTRAINT "REL_57de40bc620f456c7311aa3a1e" UNIQUE ("userId"), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "nationality" character varying NOT NULL, "pictureURL" character varying, "bio" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "body" character varying NOT NULL, "like_count" integer NOT NULL DEFAULT '0', "date" TIMESTAMP NOT NULL DEFAULT now(), "postId" uuid, "userId" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts_users_liked_users" ("postsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_8c67bf8ab42b7aae56cf56c67b5" PRIMARY KEY ("postsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_543a40af434076bad4aa4933a6" ON "posts_users_liked_users" ("postsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fee2c1190fad60606f1151ea22" ON "posts_users_liked_users" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "comments_users_liked_users" ("commentsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_62294871c4206879b6ed2b42ae9" PRIMARY KEY ("commentsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3ed6e02761fb0f5d73e518432c" ON "comments_users_liked_users" ("commentsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7f7a6bed1ec325fc7d9c976194" ON "comments_users_liked_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_ae05faaa55c866130abef6e1fee" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts_users_liked_users" ADD CONSTRAINT "FK_543a40af434076bad4aa4933a64" FOREIGN KEY ("postsId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "posts_users_liked_users" ADD CONSTRAINT "FK_fee2c1190fad60606f1151ea225" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "comments_users_liked_users" ADD CONSTRAINT "FK_3ed6e02761fb0f5d73e518432c7" FOREIGN KEY ("commentsId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "comments_users_liked_users" ADD CONSTRAINT "FK_7f7a6bed1ec325fc7d9c9761949" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments_users_liked_users" DROP CONSTRAINT "FK_7f7a6bed1ec325fc7d9c9761949"`);
        await queryRunner.query(`ALTER TABLE "comments_users_liked_users" DROP CONSTRAINT "FK_3ed6e02761fb0f5d73e518432c7"`);
        await queryRunner.query(`ALTER TABLE "posts_users_liked_users" DROP CONSTRAINT "FK_fee2c1190fad60606f1151ea225"`);
        await queryRunner.query(`ALTER TABLE "posts_users_liked_users" DROP CONSTRAINT "FK_543a40af434076bad4aa4933a64"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_ae05faaa55c866130abef6e1fee"`);
        await queryRunner.query(`DROP INDEX "IDX_7f7a6bed1ec325fc7d9c976194"`);
        await queryRunner.query(`DROP INDEX "IDX_3ed6e02761fb0f5d73e518432c"`);
        await queryRunner.query(`DROP TABLE "comments_users_liked_users"`);
        await queryRunner.query(`DROP INDEX "IDX_fee2c1190fad60606f1151ea22"`);
        await queryRunner.query(`DROP INDEX "IDX_543a40af434076bad4aa4933a6"`);
        await queryRunner.query(`DROP TABLE "posts_users_liked_users"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "posts"`);
    }

}
