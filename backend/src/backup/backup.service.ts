import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BackupService {
  constructor() {}

  // Cron job that runs every 1 hour
  @Cron('0 * * * *') // This will run the backup every day at midnight (24 hours interval)
  async backupData() {
    console.log('Backup started...');  // Log when the backup starts

    try {
      // Simulate backup logic
      console.log('Backup in progress...');
      
      // Your actual backup logic goes here
      await this.saveBackup(); // Simulated backup operation

      console.log('Backup completed successfully');  // Log when backup is completed
    } catch (error) {
      console.error('Backup failed:', error);  // Log any errors that occur during backup
    }
  }

  // Save backup to file
  private async saveBackup() {
    try {
      // Example: Writing a simple backup file to the disk
      const backupData = JSON.stringify({
        timestamp: new Date().toISOString(),
        status: 'Backup successful',
        // Add your actual data to be backed up here (e.g., user accounts, course progress)
      });

      const backupDir = path.resolve(__dirname, '../../backups');  // Path to save the backup file
      const backupFilePath = path.join(backupDir, `backup_${Date.now()}.json`);  // Backup file with timestamp in its name

      // Ensure backup directory exists
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
      }

      // Writing the backup data to a file
      fs.writeFileSync(backupFilePath, backupData);
      console.log(`Backup file created at: ${backupFilePath}`);

    } catch (error) {
      console.error('Error during backup saving:', error);
      throw new Error('Backup failed during save operation');
    }
  }
}
