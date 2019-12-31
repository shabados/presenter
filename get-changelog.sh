$(cat app/package.json | grep -Eq '"version". "[0-9]+\.[0-9]+\.[0-9]+-.*"') && IS_BETA=true

if [ $IS_BETA ]; then
    # If we are on a beta, only use the current version
    RELEASE_COUNT=1; 
else
    # Otherwise, use all the versions of the current version
    
    # Latest version is the last non-beta/alpha we can find
    LATEST_TAG=$(git show-ref --tags | grep -E '[0-9]+\.[0-9]+\.[0-9]+$' | tail -n 1 | awk -F / '{ print $3 }')
    # Count the number of x.x.x releases, includin alphas and betas
    RELEASE_COUNT=$(git show-ref --tags | grep $LATEST_TAG | wc -l)
fi

conventional-changelog -p angular -u -r $RELEASE_COUNT