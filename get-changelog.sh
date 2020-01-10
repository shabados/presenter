$(cat app/package.json | grep -Eq '"version". "[0-9]+\.[0-9]+\.[0-9]+-.*"') && IS_BETA=true

if [ $IS_BETA ]; then
    # If we are on a beta, only use the current version
    RELEASE_COUNT=1; 
else
    # Otherwise, use all the versions from the previous full release to the current
    
    # Get the release before the current
    PREVIOUS_RELEASE_TAG=$(git show-ref --tags | grep -E '[0-9]+\.[0-9]+\.[0-9]+$' | tail -n 2 | head -n 1 | awk -F / '{ print $3 }')

    # Count the number of x.x.x releases, including alphas and betas
    RELEASE_COUNT=$(git tag --contains $PREVIOUS_RELEASE_TAG | tail -n +2 | wc -l)
fi

RELEASE_COUNT=$(($RELEASE_COUNT + 1))

conventional-changelog -p angular -u -r $RELEASE_COUNT