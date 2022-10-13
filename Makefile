deploy:
	make bundle
	make upload_bundle
	make upload_deploy_script
	make execute_deploy_script

bundle:
	zip -r bundle.zip . -x node_modules/\* -x .git/\* -x .next/\* -x bundle.zip -x .env -x *.pem

upload_bundle:
	scp -i key.pem bundle.zip ubuntu@${HOST}:

upload_deploy_script:
	scp -i key.pem deploy.sh ubuntu@${HOST}:

execute_deploy_script:
	ssh -i key.pem ubuntu@${HOST} "bash deploy.sh"
