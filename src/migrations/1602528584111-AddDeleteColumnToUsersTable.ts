import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDeleteColumnToUsersTable1602528584111
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'delete',
        type: 'boolean',
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'delete');
  }
}
