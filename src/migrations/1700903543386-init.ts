import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1700903543386 implements MigrationInterface {
    name = 'Init1700903543386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`delivery_cost\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`status\` varchar(255) NOT NULL DEFAULT 'Available', \`warehouseId\` int NOT NULL, \`areaId\` int NOT NULL, \`cost\` decimal(18,3) NOT NULL, INDEX \`IDX_d510ca098dff61eda9b4064557\` (\`createdAt\`), INDEX \`IDX_4b7b9da91624c02895a44a6f9e\` (\`status\`), INDEX \`IDX_93ca0a86508e1e47fba8f36383\` (\`warehouseId\`), INDEX \`IDX_4ace69866d6d0e490c67354c95\` (\`areaId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`warehouse\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'Available', INDEX \`IDX_e1f7530b3cc612ce2463390bc4\` (\`createdAt\`), FULLTEXT INDEX \`IDX_d5d5470e55d4238b1239e9f154\` (\`name\`), INDEX \`IDX_b0dbe98601d4877a48744ad8ac\` (\`status\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`inventory\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`skuId\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'Available', \`warehouseId\` int NOT NULL, \`parcelId\` int NULL, INDEX \`IDX_6d151287aa2c7e99e16585493a\` (\`createdAt\`), INDEX \`IDX_6a71f98504bc4017fb5966c8a3\` (\`skuId\`), INDEX \`IDX_ef43024ae995c2a217d3882d25\` (\`status\`), INDEX \`IDX_00e0948a0a75d2d5a19bc1106e\` (\`warehouseId\`), INDEX \`IDX_401c0d6302a4ae81a81834cd86\` (\`parcelId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`items\` json NOT NULL, \`areaId\` int NOT NULL, INDEX \`IDX_7bb07d3c6e225d75d8418380f1\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`firstName\` varchar(80) NOT NULL, \`lastName\` varchar(80) NOT NULL, \`email\` varchar(255) NOT NULL, \`birthDate\` datetime NULL, \`phoneNumber\` varchar(255) NULL, \`avatarUrl\` varchar(255) NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`emailVerified\` tinyint NOT NULL DEFAULT 0, \`password\` varchar(255) NULL, \`refreshToken\` varchar(255) NULL, INDEX \`IDX_e11e649824a45d8ed01d597fd9\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`parcel\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`items\` json NOT NULL, \`warehouseId\` int NOT NULL, \`orderId\` int NULL, INDEX \`IDX_9f4a7bb5da9bab075ee10b96d4\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`inventory\` ADD CONSTRAINT \`FK_00e0948a0a75d2d5a19bc1106e8\` FOREIGN KEY (\`warehouseId\`) REFERENCES \`warehouse\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`inventory\` DROP FOREIGN KEY \`FK_00e0948a0a75d2d5a19bc1106e8\``);
        await queryRunner.query(`DROP INDEX \`IDX_9f4a7bb5da9bab075ee10b96d4\` ON \`parcel\``);
        await queryRunner.query(`DROP TABLE \`parcel\``);
        await queryRunner.query(`DROP INDEX \`IDX_e11e649824a45d8ed01d597fd9\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_7bb07d3c6e225d75d8418380f1\` ON \`order\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP INDEX \`IDX_401c0d6302a4ae81a81834cd86\` ON \`inventory\``);
        await queryRunner.query(`DROP INDEX \`IDX_00e0948a0a75d2d5a19bc1106e\` ON \`inventory\``);
        await queryRunner.query(`DROP INDEX \`IDX_ef43024ae995c2a217d3882d25\` ON \`inventory\``);
        await queryRunner.query(`DROP INDEX \`IDX_6a71f98504bc4017fb5966c8a3\` ON \`inventory\``);
        await queryRunner.query(`DROP INDEX \`IDX_6d151287aa2c7e99e16585493a\` ON \`inventory\``);
        await queryRunner.query(`DROP TABLE \`inventory\``);
        await queryRunner.query(`DROP INDEX \`IDX_b0dbe98601d4877a48744ad8ac\` ON \`warehouse\``);
        await queryRunner.query(`DROP INDEX \`IDX_d5d5470e55d4238b1239e9f154\` ON \`warehouse\``);
        await queryRunner.query(`DROP INDEX \`IDX_e1f7530b3cc612ce2463390bc4\` ON \`warehouse\``);
        await queryRunner.query(`DROP TABLE \`warehouse\``);
        await queryRunner.query(`DROP INDEX \`IDX_4ace69866d6d0e490c67354c95\` ON \`delivery_cost\``);
        await queryRunner.query(`DROP INDEX \`IDX_93ca0a86508e1e47fba8f36383\` ON \`delivery_cost\``);
        await queryRunner.query(`DROP INDEX \`IDX_4b7b9da91624c02895a44a6f9e\` ON \`delivery_cost\``);
        await queryRunner.query(`DROP INDEX \`IDX_d510ca098dff61eda9b4064557\` ON \`delivery_cost\``);
        await queryRunner.query(`DROP TABLE \`delivery_cost\``);
    }

}
